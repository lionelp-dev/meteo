from django.core.management.base import BaseCommand

from app.models import Sensor


DEFAULT_SENSORS = [
    {
        "name": "Temperature Sensor",
        "location": "Default Station",
        "type": Sensor.SensorType.TEMPERATURE,
        "active": True,
    },
    {
        "name": "Humidity Sensor",
        "location": "Default Station",
        "type": Sensor.SensorType.HUMIDITY,
        "active": True,
    },
    {
        "name": "Wind Sensor",
        "location": "Default Station",
        "type": Sensor.SensorType.WIND,
        "active": True,
    },
    {
        "name": "Light Sensor",
        "location": "Default Station",
        "type": Sensor.SensorType.LIGHT,
        "active": True,
    },
]


class Command(BaseCommand):
    help = "Seed default active sensors."

    def handle(self, *args, **options):
        created_count = 0
        existing_count = 0

        for sensor_data in DEFAULT_SENSORS:
            sensor, created = Sensor.objects.get_or_create(
                name=sensor_data["name"],
                defaults={
                    "location": sensor_data["location"],
                    "type": sensor_data["type"],
                    "active": sensor_data["active"],
                },
            )

            if created:
                created_count += 1
            else:
                fields_to_update = []

                for field in ("location", "type", "active"):
                    if getattr(sensor, field) != sensor_data[field]:
                        setattr(sensor, field, sensor_data[field])
                        fields_to_update.append(field)

                if fields_to_update:
                    sensor.save(update_fields=fields_to_update)

                existing_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded sensors: {created_count} created, {existing_count} already existed."
            )
        )
