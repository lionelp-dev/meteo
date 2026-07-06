import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";
import { useEffect, useRef } from "react";
import type { Sensor, SensorTypeValue } from "../../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const CHART_COLORS: Record<
  SensorTypeValue,
  { background: string; border: string; point: string }
> = {
  temperature: {
    background: "rgba(14, 116, 144, 0.12)",
    border: "rgb(14, 116, 144)",
    point: "rgb(8, 145, 178)",
  },
  humidity: {
    background: "rgba(5, 150, 105, 0.12)",
    border: "rgb(5, 150, 105)",
    point: "rgb(16, 185, 129)",
  },
  wind: {
    background: "rgba(79, 70, 229, 0.12)",
    border: "rgb(79, 70, 229)",
    point: "rgb(99, 102, 241)",
  },
  light: {
    background: "rgba(202, 138, 4, 0.14)",
    border: "rgb(202, 138, 4)",
    point: "rgb(234, 179, 8)",
  },
};

function formatMeasuredAt(measuredAt: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(measuredAt));
}

function formatChartValue(value: number, unit: string) {
  return unit === "%" ? `${value}%` : `${value} ${unit}`;
}

export function useSensorChart(sensor: Sensor) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unit = sensor.readings.at(-1)?.unit ?? "";
  const colors = CHART_COLORS[sensor.type];

  useEffect(() => {
    if (!canvasRef.current || sensor.readings.length === 0) {
      return undefined;
    }

    const config: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: sensor.readings.map((reading) =>
          formatMeasuredAt(reading.measured_at),
        ),
        datasets: [
          {
            label: `${sensor.type_label}${unit ? ` (${unit})` : ""}`,
            data: sensor.readings.map((reading) => reading.value),
            borderColor: colors.border,
            backgroundColor: colors.background,
            pointBackgroundColor: colors.point,
            pointBorderColor: colors.point,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                typeof context.parsed.y === "number"
                  ? formatChartValue(context.parsed.y, unit)
                  : "",
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
            },
          },
          y: {
            ticks: {
              callback: (value) =>
                typeof value === "number"
                  ? formatChartValue(value, unit)
                  : value,
            },
          },
        },
      },
    };

    const chart = new ChartJS(canvasRef.current, config);

    return () => chart.destroy();
  }, [colors.background, colors.border, colors.point, sensor, unit]);

  return { canvasRef };
}
