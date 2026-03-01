/**
 * @file hooks/useNetworkSlice.ts
 * @description Custom React hook for managing the network slice lifecycle.
 *
 * Handles: session creation/deletion, periodic metrics polling,
 * and exposes all state the UI needs for the before/after demo.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
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

export function useNetworkSlice(): NetworkSliceState {
    const [connected, setConnected] = useState(false);
    const [session, setSession] = useState<SessionInfo | null>(null);
    const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* ── Poll metrics every second ── */
    useEffect(() => {
        const poll = async () => {
            try {
                const m = await getMetrics(session?.sessionId);
                setMetrics(m);
                setConnected(true);
            } catch {
                setConnected(false);
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
            const s = await createSession(profile);
            setSession(s);
        } catch (err) {
            console.error("Failed to activate slice:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Tear down the active slice ── */
    const deactivateSlice = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            await deleteSession(session.sessionId);
            setSession(null);
        } catch (err) {
            console.error("Failed to deactivate slice:", err);
        } finally {
            setLoading(false);
        }
    }, [session]);

    return { connected, session, metrics, loading, activateSlice, deactivateSlice };
}
