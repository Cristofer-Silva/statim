/**
 * @file NetworkStatus.tsx
 * @description Real-time network quality panel showing 5G slice metrics.
 *
 * Displays latency, jitter, throughput, packet loss, and signal strength
 * in a compact bar. Includes a prominent "Activate / Deactivate Slice"
 * button for the hackathon demo.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-03-01
 */

import { Wifi, WifiOff, Radio, Zap, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { NetworkSliceState } from "../hooks/useNetworkSlice";

interface Props {
    network: NetworkSliceState;
}

/** Determine color based on latency quality. */
function latencyColor(ms: number): string {
    if (ms <= 15) return "#10b981";   // green — excellent
    if (ms <= 30) return "#f59e0b";   // amber — acceptable
    return "#ef4444";                  // red — poor
}

/** Compact metric chip. */
function Metric({ label, value, unit, color }: {
    label: string; value: string; unit: string; color: string;
}) {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</span>
            <span className="text-xs font-mono font-medium" style={{ color }}>{value}</span>
            <span className="text-[10px] text-zinc-600">{unit}</span>
        </div>
    );
}

/** Full network status bar with metrics and slice control. */
export function NetworkStatus({ network }: Props) {
    const { connected, session, metrics, loading, activateSlice, deactivateSlice } = network;
    const sliceActive = metrics?.sliceActive ?? false;

    if (!connected) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 rounded border border-zinc-800">
                <WifiOff className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-red-400">Backend offline</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Slice status badge */}
            {sliceActive ? (
                <Badge className="bg-emerald-600/90 text-[10px] gap-1 px-2">
                    <Radio className="w-2.5 h-2.5" />
                    5G SLICE ACTIVE
                </Badge>
            ) : (
                <Badge variant="outline" className="text-[10px] text-zinc-400 gap-1 px-2">
                    <WifiOff className="w-2.5 h-2.5" />
                    NO SLICE
                </Badge>
            )}

            {/* Live metrics */}
            {metrics && (
                <>
                    <Metric
                        label="RTT"
                        value={metrics.latencyMs.toFixed(1)}
                        unit="ms"
                        color={latencyColor(metrics.latencyMs)}
                    />
                    <Metric
                        label="Jitter"
                        value={metrics.jitterMs.toFixed(1)}
                        unit="ms"
                        color={metrics.jitterMs < 3 ? "#10b981" : "#f59e0b"}
                    />
                    <Metric
                        label="↓"
                        value={metrics.throughputMbps.toFixed(0)}
                        unit="Mbps"
                        color={metrics.throughputMbps > 50 ? "#10b981" : "#f59e0b"}
                    />
                    <Metric
                        label="Loss"
                        value={metrics.packetLossPct.toFixed(2)}
                        unit="%"
                        color={metrics.packetLossPct < 0.1 ? "#10b981" : "#ef4444"}
                    />
                </>
            )}

            {/* Slice control button */}
            {sliceActive ? (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] border-red-600/50 text-red-400 hover:bg-red-600/20"
                    onClick={deactivateSlice}
                    disabled={loading}
                >
                    Deactivate Slice
                </Button>
            ) : (
                <Button
                    size="sm"
                    className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => activateSlice("QOS_E")}
                    disabled={loading}
                >
                    <Zap className="w-3 h-3 mr-1" />
                    {loading ? "Activating..." : "Activate 5G Slice"}
                </Button>
            )}
        </div>
    );
}
