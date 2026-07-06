import random
import time
from decimal import Decimal

from django.core.management.base import BaseCommand

from app.models import Sensor, SensorReading


# Parametres de simulation par type de capteur: unite, plage de depart,
# variation a chaque generation, bornes realistes et precision stockee.
RULES = {
    Sensor.SensorType.TEMPERATURE: {
        "unit": "C",
        "initial": (16, 26),
        "delta": (-0.3, 0.3),
        "bounds": (-5, 40),
        "decimals": 1,
    },
    Sensor.SensorType.HUMIDITY: {
        "unit": "%",
        "initial": (40, 75),
        "delta": (-2, 2),
        "bounds": (20, 100),
        "decimals": 0,
    },
    Sensor.SensorType.WIND: {
        "unit": "km/h",
        "initial": (2, 25),
        "delta": (-5, 5),
        "bounds": (0, 90),
        "decimals": 0,
    },
    Sensor.SensorType.LIGHT: {
        "unit": "lux",
        "initial": (150, 900),
        "delta": (-120, 120),
        "bounds": (0, 1200),
        "decimals": 0,
    },
}


def clamp(value, minimum, maximum):
    return min(max(value, minimum), maximum)


def to_decimal(value, decimals):
    # Decimal garde une precision stable avant l'enregistrement en base.
    quantizer = Decimal("1") if decimals == 0 else Decimal(f"1.{'0' * decimals}")

    return Decimal(str(value)).quantize(quantizer)


def next_value(sensor):
    rule = RULES[sensor.type]
    latest_reading = sensor.readings.first()

    if latest_reading is None:
        # Plage de depart plausible pour un capteur sans historique.
        value = random.uniform(*rule["initial"])
    else:
        # Petite derive appliquee a la derniere valeur connue.
        value = float(latest_reading.value) + random.uniform(*rule["delta"])

    # Les bornes evitent que la simulation sorte d'une plage realiste.
    value = clamp(value, *rule["bounds"])

    return to_decimal(value, rule["decimals"]), rule["unit"]


def generate_readings():
    readings = []

    for sensor in Sensor.objects.filter(active=True):
        value, unit = next_value(sensor)
        readings.append(
            SensorReading(
                sensor=sensor,
                value=value,
                unit=unit,
            )
        )

    # Insertion groupee pour eviter une requete SQL par capteur.
    SensorReading.objects.bulk_create(readings)

    return len(readings)


class Command(BaseCommand):
    help = "Generate simulated readings for active sensors."

    def add_arguments(self, parser):
        parser.add_argument(
            "--loop",
            action="store_true",
            help="Keep generating readings until the command is stopped.",
        )
        parser.add_argument(
            "--interval",
            type=int,
            default=5,
            help="Seconds between generations when using --loop.",
        )

    def handle(self, *args, **options):
        while True:
            count = generate_readings()
            self.stdout.write(self.style.SUCCESS(f"Generated {count} readings."))

            if not options["loop"]:
                break

            # En mode boucle, la commande sert de simulateur local continu.
            time.sleep(options["interval"])
