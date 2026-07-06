import { useSensorChart } from "../hooks/useSensorChart";
import type { Sensor } from "../../../types";

export default function SensorChart({ sensor }: { sensor: Sensor }) {
  const { canvasRef } = useSensorChart(sensor);

  return (
    <article
      className={`rounded-md border border-slate-200 bg-white p-4 shadow-sm ${
        sensor.active ? "" : "opacity-70"
      }`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-950">
            {sensor.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {sensor.location} · {sensor.type_label}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            sensor.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {sensor.active ? "Actif" : "Inactif"}
        </span>
      </header>

      {sensor.readings.length > 0 ? (
        <div className="h-64">
          <canvas ref={canvasRef} />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
          Aucune mesure
        </div>
      )}
    </article>
  );
}
