from django.urls import path

from .views import PincodeServiceabilityView

urlpatterns = [
    path("pincode-check/", PincodeServiceabilityView.as_view(), name="pincode-check"),
]
