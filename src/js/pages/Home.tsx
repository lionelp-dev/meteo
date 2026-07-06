import { usePoll } from "@inertiajs/react";
import SensorsChart from "../features/sensors-chart/index.sensors-chart";
import type { SensorsChartProps } from "../types";

export default function Home(props: SensorsChartProps) {
  usePoll(4000, {
    only: ["sensors"],
  });

  return <SensorsChart {...props} />;
}
