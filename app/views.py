import json

from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_POST
from inertia import render

from .models import Sensor
from .serializers import serialize_sensors, serialize_sensor_types


def request_data(request):
    if request.POST:
        return request.POST

    if request.body:
        try:
            return json.loads(request.body)
        except json.JSONDecodeError:
            return {}

    return {}


def index(request):
    return render(
        request,
        "Home",
        props={
            "sensors": serialize_sensors,
            "sensor_types": serialize_sensor_types,
        },
    )


@require_POST
def store_sensor(request):
    data = request_data(request)
    name = data.get("name", "").strip()
    location = data.get("location", "").strip() or "Non renseigne"
    sensor_type = data.get("type", Sensor.SensorType.TEMPERATURE)
    valid_types = {value for value, _label in Sensor.SensorType.choices}

    if name and sensor_type in valid_types:
        Sensor.objects.create(name=name, location=location, type=sensor_type)

    return redirect("index")


@require_POST
def toggle_sensor(request, sensor_id):
    sensor = get_object_or_404(Sensor, id=sensor_id)
    sensor.active = not sensor.active
    sensor.save(update_fields=["active"])

    return redirect("index")


@require_POST
def delete_sensor(request, sensor_id):
    sensor = get_object_or_404(Sensor, id=sensor_id)
    sensor.delete()

    return redirect("index")
