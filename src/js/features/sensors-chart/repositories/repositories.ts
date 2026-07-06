import { router } from "@inertiajs/react";

export function toggleSensor(sensorId: number) {
  router.post(
    `/sensors/${sensorId}/toggle/`,
    {},
    {
      preserveScroll: true,
    },
  );
}

export function deleteSensor(sensorId: number) {
  router.post(
    `/sensors/${sensorId}/delete/`,
    {},
    {
      preserveScroll: true,
    },
  );
}
