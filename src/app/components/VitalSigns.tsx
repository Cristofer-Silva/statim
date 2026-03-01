/**
 * @file VitalSigns.tsx
 * @description Compact vital-sign indicators displayed in the bottom bar.
 *
 * Shows four patient metrics: Heart Rate, Blood Pressure, SpO₂, and
 * Respiratory Rate, each color-coded for quick visual scanning.
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { Activity, Heart, Wind, Droplets } from "lucide-react";

/** Props for a single vital-sign indicator. */
interface VitalSignProps {
  /** Abbreviated label shown above the value (e.g. "HR", "BP"). */
  label: string;
  /** Numeric reading as a string (e.g. "74", "120/80"). */
  value: string;
  /** Measurement unit displayed after the value (e.g. "bpm", "mmHg"). */
  unit: string;
  /** CSS color string used for the value text. */
  color: string;
}

/** Single vital-sign chip with label, value, and unit. */
function VitalSign({ label, value, unit, color }: VitalSignProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/80 backdrop-blur-sm rounded border border-zinc-800">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm font-mono" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-zinc-600">{unit}</div>
    </div>
  );
}

/** Row of all patient vital signs. */
export function VitalSigns() {
  return (
    <div className="flex items-center gap-3">
      <VitalSign label="HR" value="74" unit="bpm" color="#ef4444" />
      <VitalSign label="BP" value="120/80" unit="mmHg" color="#3b82f6" />
      <VitalSign label="SpO2" value="98" unit="%" color="#10b981" />
      <VitalSign label="RR" value="16" unit="/min" color="#8b5cf6" />
    </div>
  );
}