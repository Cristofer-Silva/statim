/**
 * @file App.tsx
 * @description Root layout component for the Remote Surgery Interface.
 *
 * Composes the full surgical console into three zones:
 *  - Top bar:    Two rows — patient info + motion on row 1,
 *                network status + procedure badge on row 2
 *  - Main area:  Live video feed (left) + physical controls sidebar (right)
 *  - Bottom bar: Real-time vital signs and active instrument status
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { VideoFeed } from "./components/VideoFeed";
import { VitalSigns } from "./components/VitalSigns";
import { ToolStatus } from "./components/ToolStatus";
import { MotionControls } from "./components/MotionControls";
import { PhysicalControls } from "./components/PhysicalControls";
import { NetworkStatus } from "./components/NetworkStatus";
import { Badge } from "./components/ui/badge";
import { useNetworkSlice } from "./hooks/useNetworkSlice";

/** Main application shell — arranges all surgical interface panels. */
export default function App() {
  const network = useNetworkSlice();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Top Bar ── Two-row header to avoid overflow ── */}
      <div className="border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm">
        {/* Row 1: Patient info + motion controls + procedure badge */}
        <div className="px-4 py-1.5 flex items-center justify-between border-b border-zinc-800/30">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs">
              Patient #87452
            </Badge>
            <span className="text-xs text-zinc-500">Laparoscopic Cholecystectomy</span>
            <div className="h-4 w-px bg-zinc-800" />
            <MotionControls />
          </div>
          <Badge className="bg-green-600 text-xs shrink-0">
            PROCEDURE IN PROGRESS
          </Badge>
        </div>

        {/* Row 2: Network metrics + slice control */}
        <div className="px-4 py-1.5 flex items-center justify-center">
          <NetworkStatus network={network} />
        </div>
      </div>

      {/* ── Main Content ── Video feed + right sidebar ── */}
      <div className="flex-1 flex">
        {/* Primary camera view — receives live latency from backend */}
        <div className="flex-1 relative">
          <VideoFeed metrics={network.metrics} />
        </div>

        {/* Right sidebar — arm, clutch, pedal, and emergency controls */}
        <div className="w-64 border-l border-zinc-800/50 bg-zinc-950/50 p-4 flex flex-col gap-3">
          <PhysicalControls />
        </div>
      </div>

      {/* ── Bottom Bar ── Vitals & active instrument info ── */}
      <div className="border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm">
        <div className="px-6 py-3 flex items-center justify-between gap-6">
          <VitalSigns />
          <ToolStatus />
        </div>
      </div>
    </div>
  );
}