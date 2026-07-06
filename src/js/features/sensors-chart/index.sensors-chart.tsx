import { useForm } from "@inertiajs/react";
import type { SubmitEvent } from "react";
import type {
  SensorFormData,
  SensorTypeValue,
  SensorsChartProps,
} from "../../types";
import SensorChart from "./components/SensorChart";
import { deleteSensor, toggleSensor } from "./repositories/repositories";

export default function SensorsChart({
  sensors = [],
  sensor_types = [],
}: SensorsChartProps) {
  const defaultSensorType = sensor_types[0]?.value ?? "temperature";
  const { data, setData, post, processing, reset } = useForm<SensorFormData>({
    name: "",
    location: "",
    type: defaultSensorType,
  });

  const activeCount = sensors.filter((sensor) => sensor.active).length;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!data.name.trim()) {
      return;
    }

    post("/sensors/", {
      preserveScroll: true,
      onSuccess: () => reset("name", "location"),
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 lg:px-6">
      <section className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <header className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
              Meteo
            </p>
            <div>
              <h1 className="text-3xl font-bold">Capteurs meteo</h1>
              <p className="mt-1 text-sm text-slate-600">
                {activeCount} actif{activeCount > 1 ? "s" : ""} sur{" "}
                {sensors.length} capteur{sensors.length > 1 ? "s" : ""}
              </p>
            </div>
          </header>

          <form
            className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Nom du capteur
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                onChange={(event) => setData("name", event.target.value)}
                placeholder="Thermometre salon"
                type="text"
                value={data.name}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Emplacement
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                onChange={(event) => setData("location", event.target.value)}
                placeholder="Cuisine"
                type="text"
                value={data.location}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Type
              <select
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                onChange={(event) =>
                  setData("type", event.target.value as SensorTypeValue)
                }
                value={data.type}
              >
                {sensor_types.map((sensorType) => (
                  <option key={sensorType.value} value={sensorType.value}>
                    {sensorType.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="rounded-md bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={processing || !data.name.trim()}
              type="submit"
            >
              Ajouter
            </button>
          </form>

          <ul className="flex flex-col gap-3">
            {sensors.map((sensor) => (
              <li
                className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                key={sensor.id}
              >
                <div className="flex items-start gap-3">
                  <button
                    aria-label={
                      sensor.active
                        ? `Desactiver ${sensor.name}`
                        : `Activer ${sensor.name}`
                    }
                    className={`mt-1 h-5 w-5 rounded border transition ${
                      sensor.active
                        ? "border-cyan-700 bg-cyan-700"
                        : "border-slate-300 bg-white"
                    }`}
                    onClick={() => toggleSensor(sensor.id)}
                    type="button"
                  />
                  <div className="min-w-0 flex-1">
                    <h2
                      className={`truncate font-semibold ${
                        sensor.active ? "text-slate-950" : "text-slate-400"
                      }`}
                    >
                      {sensor.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {sensor.location} · {sensor.type_label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      sensor.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {sensor.active ? "Actif" : "Inactif"}
                  </span>
                  <button
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => deleteSensor(sensor.id)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
                Supervision
              </p>
              <h2 className="text-2xl font-bold">Mesures</h2>
            </div>
            <span className="w-fit rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-800">
              {sensors.length} chart{sensors.length > 1 ? "s" : ""}
            </span>
          </div>

          {sensors.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {sensors.map((sensor) => (
                <SensorChart key={sensor.id} sensor={sensor} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-sm font-medium text-slate-500">
              Aucun capteur
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
