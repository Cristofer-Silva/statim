/**
 * @file ToolStatus.tsx
 * @description Displays the currently attached instruments on each robotic arm,
 *              including electrosurgical energy mode and wattage when applicable.
 *
 * Shown in the bottom bar alongside vital signs.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { Zap } from "lucide-react";
import { Badge } from "./ui/badge";

/** Props for a single instrument card. */
interface ToolProps {
  /** Arm identifier (e.g. "ARM 1"). */
  arm: string;
  /** Name of the attached instrument (e.g. "Maryland Bipolar"). */
  instrument: string;
  /** Optional electrosurgical energy settings. */
  energy?: {
    /** Energy delivery mode. */
    mode: "cut" | "coag";
    /** Power level in watts. */
    level: number;
  };
}

/** Single instrument indicator with optional energy readout. */
function Tool({ arm, instrument, energy }: ToolProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 backdrop-blur-sm rounded border border-zinc-800">
      <div className="text-xs text-zinc-500">{arm}</div>
      <div className="text-xs text-zinc-300">{instrument}</div>
      {energy && (
        <div className="flex items-center gap-1.5 ml-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <div className="text-xs font-mono text-yellow-400">
            {energy.mode === "cut" ? "CUT" : "COAG"} {energy.level}W
          </div>
        </div>
      )}
    </div>
  );
}

/** Row of all active robotic arm instruments. */
export function ToolStatus() {
  return (
    <div className="flex items-center gap-3">
      <Tool arm="ARM 1" instrument="Maryland Bipolar" energy={{ mode: "coag", level: 25 }} />
      <Tool arm="ARM 2" instrument="Monopolar Scissors" energy={{ mode: "cut", level: 30 }} />
      <Tool arm="ARM 3" instrument="Grasper" />
    </div>
  );
}
