/**
 * @file hooks/useNetworkSlice.ts
 * @description Custom React hook for managing the network slice lifecycle.
 *
 * Handles: session creation/deletion, periodic metrics polling,
 * and exposes all state the UI needs for the before/after demo.
 *
 * When the backend is unreachable (e.g. on GitHub Pages), the hook
 * automatically falls back to client-side simulation that mirrors
 * the Python simulator's metric ranges and behaviour.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.2
 * @since    2026-03-01
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
    createSession,
    deleteSession,
    getMetrics,
    type NetworkMetrics,
    type SessionInfo,
} from "../api";

/** Polling interval for metrics (ms). */
const POLL_INTERVAL = 1000;

export interface NetworkSliceState {
    /** Whether the backend is reachable. */
    connected: boolean;
    /** Current session details, or null if no slice is active. */
    session: SessionInfo | null;
    /** Latest network quality metrics from the backend. */
    metrics: NetworkMetrics | null;
    /** True while an API call is in progress. */
    loading: boolean;
    /** Activate a QoD network slice. */
    activateSlice: (profile?: string) => Promise<void>;
    /** Tear down the active network slice. */
    deactivateSlice: () => Promise<void>;
}

/* ── Client-side simulation (mirrors backend/services/simulator.py) ── */

/** Return a random float between min and max (inclusive). */
function randUniform(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

/** Return a random integer between min and max (inclusive). */
function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate simulated metrics matching the Python simulator's ranges. */
function simulateMetrics(sliceActive: boolean, qosProfile: string | null): NetworkMetrics {
    if (sliceActive && qosProfile) {
        // ── Enhanced metrics when QoD slice is active ──
        const baseLatency: Record<string, number> = {
            QOS_E: 8.0, QOS_S: 18.0, QOS_M: 35.0, QOS_L: 70.0,
        };
        const base = baseLatency[qosProfile] ?? 30.0;

        return {
            latencyMs: Math.round((base + randUniform(-2.0, 4.0)) * 10) / 10,
            jitterMs: Math.round(randUniform(0.2, 1.5) * 10) / 10,
            throughputMbps: Math.round(randUniform(80.0, 120.0) * 10) / 10,
            packetLossPct: Math.round(randUniform(0.0, 0.02) * 1000) / 1000,
            signalStrengthDbm: randInt(-55, -45),
            sliceActive: true,
            qosProfile,
            timestamp: new Date().toISOString(),
        };
    }

    // ── Degraded best-effort metrics (no slice) ──
    return {
        latencyMs: Math.round(randUniform(40.0, 120.0) * 10) / 10,
        jitterMs: Math.round(randUniform(5.0, 25.0) * 10) / 10,
        throughputMbps: Math.round(randUniform(10.0, 40.0) * 10) / 10,
        packetLossPct: Math.round(randUniform(0.1, 2.0) * 1000) / 1000,
        signalStrengthDbm: randInt(-80, -65),
        sliceActive: false,
        qosProfile: null,
        timestamp: new Date().toISOString(),
    };
}

/** Create a simulated session object. */
function simulateSession(profile: string): SessionInfo {
    const now = new Date();
    const expires = new Date(now.getTime() + 3600 * 1000);
    return {
        sessionId: crypto.randomUUID(),
        device: { ipv4Address: "10.0.0.1" },
        applicationServer: { ipv4Address: "192.168.1.100" },
        qosProfile: profile,
        qosStatus: "AVAILABLE",
        statusInfo: null,
        duration: 3600,
        startedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
    };
}

export function useNetworkSlice(): NetworkSliceState {
    const [connected, setConnected] = useState(false);
    const [session, setSession] = useState<SessionInfo | null>(null);
    const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /**
     * Whether we're using client-side simulation because the backend
     * is unreachable (e.g. deployed on GitHub Pages).
     */
    const simulationMode = useRef(false);

    /* ── Poll metrics every second ── */
    useEffect(() => {
        const poll = async () => {
            // If we already know we're in simulation mode, skip the API call
            if (simulationMode.current) {
                const sliceActive = session !== null;
                const profile = session?.qosProfile ?? null;
                setMetrics(simulateMetrics(sliceActive, profile));
                setConnected(true);
                return;
            }

            try {
                const m = await getMetrics(session?.sessionId);
                setMetrics(m);
                setConnected(true);
            } catch {
                // Backend unreachable — switch to client-side simulation
                simulationMode.current = true;
                const sliceActive = session !== null;
                const profile = session?.qosProfile ?? null;
                setMetrics(simulateMetrics(sliceActive, profile));
                setConnected(true);
            }
        };

        // Initial fetch
        poll();

        // Start polling
        intervalRef.current = setInterval(poll, POLL_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [session?.sessionId]);

    /* ── Activate a QoD slice ── */
    const activateSlice = useCallback(async (profile = "QOS_E") => {
        setLoading(true);
        try {
            if (simulationMode.current) {
                setSession(simulateSession(profile));
            } else {
                const s = await createSession(profile);
                setSession(s);
            }
        } catch (err) {
            // If API fails mid-use, fall back to simulation
            simulationMode.current = true;
            setSession(simulateSession(profile));
            console.warn("Backend unreachable, using simulation:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Tear down the active slice ── */
    const deactivateSlice = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            if (!simulationMode.current) {
                await deleteSession(session.sessionId);
            }
            setSession(null);
        } catch (err) {
            // Even if API fails, still deactivate locally
            simulationMode.current = true;
            setSession(null);
            console.warn("Backend unreachable, deactivated locally:", err);
        } finally {
            setLoading(false);
        }
    }, [session]);

    return { connected, session, metrics, loading, activateSlice, deactivateSlice };
}
