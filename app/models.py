from django.db import models
from django.utils import timezone


class Sensor(models.Model):
    class SensorType(models.TextChoices):
        TEMPERATURE = "temperature", "Temperature"
        HUMIDITY = "humidity", "Humidity"
        WIND = "wind", "Wind"
        LIGHT = "light", "Light"

    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    type = models.CharField(
        max_length=20,
        choices=SensorType.choices,
        default=SensorType.TEMPERATURE,
    )
    active = models.BooleanField(default=True)


class SensorReading(models.Model):
    sensor = models.ForeignKey(
        Sensor,
        related_name="readings",
        on_delete=models.CASCADE,
    )
    value = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=10)
    measured_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-measured_at"]
