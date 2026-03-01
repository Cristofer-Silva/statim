/**
 * @file api.ts
 * @description HTTP client for the Statim backend API.
 *
 * Provides typed functions for every backend endpoint:
 * health check, QoS profiles, session management, and metrics.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-03-01
 */

const API_BASE = "http://localhost:8000/api";

/* ── Types matching backend Pydantic models ── */

export interface HealthResponse {
    status: string;
    mode: "simulation" | "live";
    version: string;
    camara_endpoint: string | null;
}

export interface QosProfile {
    name: string;
    description: string;
    status: "ACTIVE" | "INACTIVE" | "DEPRECATED";
    maxLatencyMs: number | null;
    minThroughputKbps: number | null;
}

export interface SessionInfo {
    sessionId: string;
    device: { ipv4Address?: string } | null;
    applicationServer: { ipv4Address?: string };
    qosProfile: string;
    qosStatus: "REQUESTED" | "AVAILABLE" | "UNAVAILABLE";
    statusInfo: string | null;
    duration: number;
    startedAt: string | null;
    expiresAt: string | null;
}

export interface NetworkMetrics {
    latencyMs: number;
    jitterMs: number;
    throughputMbps: number;
    packetLossPct: number;
    signalStrengthDbm: number;
    sliceActive: boolean;
    qosProfile: string | null;
    timestamp: string;
}

/* ── API functions ── */

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
    } finally {
        clearTimeout(timeout);
    }
}

/** Check backend health and operating mode. */
export const getHealth = () =>
    fetchJson<HealthResponse>(`${API_BASE}/health`);

/** List available QoS profiles. */
export const getProfiles = () =>
    fetchJson<QosProfile[]>(`${API_BASE}/network/profiles`);

/** Create a new QoD session (activate network slice). */
export const createSession = (qosProfile = "QOS_E", duration = 3600) =>
    fetchJson<SessionInfo>(`${API_BASE}/network/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            applicationServer: { ipv4Address: "192.168.1.100" },
            device: { ipv4Address: "10.0.0.1" },
            qosProfile,
            duration,
        }),
    });

/** Get session status. */
export const getSession = (sessionId: string) =>
    fetchJson<SessionInfo>(`${API_BASE}/network/session/${sessionId}`);

/** Extend an active session. */
export const extendSession = (sessionId: string, extraSeconds: number) =>
    fetchJson<SessionInfo>(`${API_BASE}/network/session/${sessionId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedAdditionalDuration: extraSeconds }),
    });

/** Delete a session (tear down network slice). */
export const deleteSession = (sessionId: string) =>
    fetchJson<SessionInfo>(`${API_BASE}/network/session/${sessionId}`, {
        method: "DELETE",
    });

/** Get real-time network metrics. */
export const getMetrics = (sessionId?: string) => {
    const url = sessionId
        ? `${API_BASE}/network/metrics?session_id=${sessionId}`
        : `${API_BASE}/network/metrics`;
    return fetchJson<NetworkMetrics>(url);
};
