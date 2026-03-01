/**
 * @file PhysicalControls.tsx
 * @description Right-sidebar panel with all physical surgical console controls.
 *
 * Organized into four sections:
 *  1. Arm Control   — Select which robotic arm each hand drives + lens wash
 *  2. Clutches      — Master & camera clutch (hold-to-activate)
 *  3. Foot Pedals   — Monopolar CUT (yellow) and COAG (blue) with press feedback
 *  4. Emergency Stop — Full-width red kill switch
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Hand,
  Camera,
  Droplets,
  AlertOctagon,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

/** Complete physical-controls sidebar for the surgeon console. */
export function PhysicalControls() {
  /* ── Clutch state (press-and-hold) ── */
  const [masterClutch, setMasterClutch] = useState(false);
  const [cameraClutch, setCameraClutch] = useState(false);

  /* ── Arm assignment ── */
  const [activeLeftArm, setActiveLeftArm] = useState<1 | 3>(1);
  const [activeRightArm, setActiveRightArm] = useState<2>(2);

  /* ── Foot pedal state (press-and-hold) ── */
  const [yellowPressed, setYellowPressed] = useState(false);
  const [bluePressed, setBluePressed] = useState(false);

  return (
    <div className="flex flex-col gap-3">

      {/* ── Section 1: Arm Control ── */}
      <Card className="p-3 bg-zinc-900/90 backdrop-blur-sm border-zinc-800">
        <div className="text-xs text-zinc-500 mb-2 font-medium">ARM CONTROL</div>
        <div className="space-y-2">
          {/* Left hand — toggle between Arm 1 and Arm 3 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-12">Left</span>
            <Button size="sm" variant={activeLeftArm === 1 ? "default" : "outline"} className="h-7 flex-1 text-xs" onClick={() => setActiveLeftArm(1)}>ARM 1</Button>
            <Button size="sm" variant={activeLeftArm === 3 ? "default" : "outline"} className="h-7 flex-1 text-xs" onClick={() => setActiveLeftArm(3)}>ARM 3</Button>
          </div>
          {/* Right hand — fixed to Arm 2 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-12">Right</span>
            <Button size="sm" variant="default" className="h-7 flex-1 text-xs" disabled>ARM 2</Button>
          </div>
          <Button size="sm" variant="outline" className="w-full h-7 text-xs">
            <Droplets className="w-3 h-3 mr-1.5" />
            Lens Wash
          </Button>
        </div>
      </Card>

      {/* ── Section 2: Clutches (hold-to-activate) ── */}
      <Card className="p-3 bg-zinc-900/90 backdrop-blur-sm border-zinc-800">
        <div className="text-xs text-zinc-500 mb-2 font-medium">CLUTCHES</div>
        <div className="space-y-2">
          <Button
            size="sm" variant={masterClutch ? "default" : "outline"} className="w-full h-8 text-xs"
            onMouseDown={() => setMasterClutch(true)}
            onMouseUp={() => setMasterClutch(false)}
            onMouseLeave={() => setMasterClutch(false)}
          >
            <Hand className="w-3 h-3 mr-2" />
            Master Clutch
            {masterClutch && <span className="ml-2 text-green-400">ACTIVE</span>}
          </Button>
          <Button
            size="sm" variant={cameraClutch ? "default" : "outline"} className="w-full h-8 text-xs"
            onMouseDown={() => setCameraClutch(true)}
            onMouseUp={() => setCameraClutch(false)}
            onMouseLeave={() => setCameraClutch(false)}
          >
            <Camera className="w-3 h-3 mr-2" />
            Camera Clutch
            {cameraClutch && <span className="ml-2 text-green-400">ACTIVE</span>}
          </Button>
        </div>
      </Card>

      {/* ── Section 3: Foot Pedals ── */}
      <Card className="p-3 bg-zinc-900/90 backdrop-blur-sm border-zinc-800">
        <div className="text-xs text-zinc-500 mb-3 font-medium">FOOT PEDALS</div>
        <div className="space-y-3">
          {/* Yellow pedal — Monopolar CUT */}
          <div className="flex items-center gap-2">
            <motion.button
              className={`w-full h-10 rounded border-2 transition-all ${yellowPressed
                ? "bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50"
                : "bg-yellow-500/20 border-yellow-600 hover:bg-yellow-500/30"
                }`}
              onMouseDown={() => setYellowPressed(true)}
              onMouseUp={() => setYellowPressed(false)}
              onMouseLeave={() => setYellowPressed(false)}
              animate={{ scale: yellowPressed ? 0.95 : 1 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex items-center justify-center gap-2 h-full">
                <Zap className={`w-4 h-4 ${yellowPressed ? "text-zinc-900" : "text-yellow-400"}`} />
                <span className={`text-xs font-medium ${yellowPressed ? "text-zinc-900" : "text-yellow-400"}`}>
                  CUT {yellowPressed && "(ACTIVE)"}
                </span>
              </div>
            </motion.button>
          </div>

          {/* Blue pedal — Coagulation */}
          <div className="flex items-center gap-2">
            <motion.button
              className={`w-full h-10 rounded border-2 transition-all ${bluePressed
                ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50"
                : "bg-blue-500/20 border-blue-600 hover:bg-blue-500/30"
                }`}
              onMouseDown={() => setBluePressed(true)}
              onMouseUp={() => setBluePressed(false)}
              onMouseLeave={() => setBluePressed(false)}
              animate={{ scale: bluePressed ? 0.95 : 1 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex items-center justify-center gap-2 h-full">
                <Zap className={`w-4 h-4 ${bluePressed ? "text-zinc-900" : "text-blue-400"}`} />
                <span className={`text-xs font-medium ${bluePressed ? "text-zinc-900" : "text-blue-400"}`}>
                  COAG {bluePressed && "(ACTIVE)"}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </Card>

      {/* ── Section 4: Emergency Stop ── */}
      <Button
        size="sm" variant="destructive"
        className="w-full h-12 text-sm font-bold bg-red-600 hover:bg-red-700"
      >
        <AlertOctagon className="w-5 h-5 mr-2" />
        EMERGENCY STOP
      </Button>
    </div>
  );
}