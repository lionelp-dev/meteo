from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("sensors/", views.store_sensor, name="sensors.store"),
    path("sensors/<int:sensor_id>/toggle/", views.toggle_sensor, name="sensors.toggle"),
    path("sensors/<int:sensor_id>/delete/", views.delete_sensor, name="sensors.delete"),
]
