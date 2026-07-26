from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .providers import get_shipping_provider


class PincodeServiceabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        pincode = request.query_params.get("pincode", "")
        if not pincode or len(pincode) != 6 or not pincode.isdigit():
            return Response({"error": {"code": "invalid_pincode", "message": "Enter a valid 6-digit pincode."}}, status=400)
        result = get_shipping_provider().check_serviceability(pincode)
        return Response(result)
