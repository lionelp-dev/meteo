from django.db.models import Prefetch

from .models import Sensor, SensorReading


def format_reading_value(value):
    return format(value.normalize(), "f")


def format_reading(reading):
    value = format_reading_value(reading.value)

    if reading.unit == "%":
        return f"{value}%"

    return f"{value} {reading.unit}"


def serialize_reading_point(reading):
    return {
        "value": float(reading.value),
        "unit": reading.unit,
        "measured_at": reading.measured_at.isoformat(),
    }


def serialize_sensor(sensor):
    readings = list(getattr(sensor, "prefetched_readings", []))
    latest_reading = next(iter(readings), None)

    if not sensor.active:
        reading = "Hors ligne"
    elif latest_reading is None:
        reading = "--"
    else:
        reading = format_reading(latest_reading)

    return {
        "id": sensor.id,
        "name": sensor.name,
        "location": sensor.location,
        "type": sensor.type,
        "type_label": sensor.get_type_display(),
        "reading": reading,
        "readings": [
            serialize_reading_point(reading)
            for reading in reversed(readings)
        ],
        "active": sensor.active,
    }


def serialize_sensors():
    sensors = Sensor.objects.prefetch_related(
        Prefetch(
            "readings",
            queryset=SensorReading.objects.order_by("-measured_at")[:20],
            to_attr="prefetched_readings",
        )
    ).order_by("id")

    return [serialize_sensor(sensor) for sensor in sensors]


def serialize_sensor_types():
    return [
        {"value": value, "label": label}
        for value, label in Sensor.SensorType.choices
    ]
