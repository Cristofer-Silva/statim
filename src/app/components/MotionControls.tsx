/**
 * @file MotionControls.tsx
 * @description Motion scaling selector and camera zoom/rotation controls.
 *
 * Rendered in the top bar. Lets the surgeon adjust:
 *  - Motion scale ratio (3:1 Normal, 5:1 Fine, 7:1 Ultra-Fine)
 *  - Camera zoom level (1.0x – 5.0x in 0.5 increments)
 *  - Camera rotation and home reset
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Move, ZoomIn, ZoomOut, RotateCw, Home } from "lucide-react";

/** Available motion scaling presets. */
const SCALE_OPTIONS = [
  { value: 3, label: "Normal" },
  { value: 5, label: "Fine" },
  { value: 7, label: "Ultra-Fine" },
];

/** Motion scaling selector and camera zoom/orient controls. */
export function MotionControls() {
  const [scale, setScale] = useState<number>(3);
  const [cameraZoom, setCameraZoom] = useState<number>(1);

  return (
    <div className="flex items-center gap-4">

      {/* ── Motion Scale Selector ── */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 backdrop-blur-sm rounded border border-zinc-800">
        <Move className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-xs text-zinc-500">Motion Scale</span>
        <div className="flex gap-1">
          {SCALE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setScale(option.value)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${scale === option.value
                ? "bg-blue-600 text-white font-medium"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
            >
              <div className="font-mono">{option.value}:1</div>
              <div className="text-xs opacity-75">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Camera Zoom & Orientation ── */}
      <div className="flex items-center gap-1 px-2 py-2 bg-zinc-900/80 backdrop-blur-sm rounded border border-zinc-800">
        {/* Zoom out */}
        <Button
          size="sm" variant="ghost"
          className="h-6 w-6 p-0 hover:bg-zinc-800"
          onClick={() => setCameraZoom(Math.max(1, cameraZoom - 0.5))}
        >
          <ZoomOut className="w-3 h-3 text-zinc-400" />
        </Button>

        {/* Current zoom readout */}
        <div className="px-2 text-xs font-mono text-zinc-400 min-w-[3rem] text-center">
          {cameraZoom.toFixed(1)}x
        </div>

        {/* Zoom in */}
        <Button
          size="sm" variant="ghost"
          className="h-6 w-6 p-0 hover:bg-zinc-800"
          onClick={() => setCameraZoom(Math.min(5, cameraZoom + 0.5))}
        >
          <ZoomIn className="w-3 h-3 text-zinc-400" />
        </Button>

        <div className="w-px h-4 bg-zinc-700 mx-1" />

        {/* Rotate camera */}
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-zinc-800">
          <RotateCw className="w-3 h-3 text-zinc-400" />
        </Button>

        {/* Reset to home position */}
        <Button
          size="sm" variant="ghost"
          className="h-6 w-6 p-0 hover:bg-zinc-800"
          onClick={() => setCameraZoom(1)}
        >
          <Home className="w-3 h-3 text-zinc-400" />
        </Button>
      </div>
    </div>
  );
}