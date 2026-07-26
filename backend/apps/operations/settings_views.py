from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from .audit import log_action
from .models import StoreSetting
from .permissions import HasOperationsPermission, IsOperationsStaff


class StoreSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSetting
        fields = "__all__"


class StoreSettingsView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "settings.view"

    def get(self, request):
        settings_qs = StoreSetting.objects.all()
        return Response({s.key: s.value for s in settings_qs})


class StoreSettingUpdateView(APIView):
    permission_classes = [IsOperationsStaff, HasOperationsPermission]
    permission_code = "settings.manage"

    def patch(self, request, key):
        setting, created = StoreSetting.objects.get_or_create(key=key, defaults={"value": request.data.get("value")})
        before = setting.value
        if not created:
            setting.value = request.data.get("value")
            setting.save(update_fields=["value"])
        log_action(
            staff=request.user, action="update", resource_type="store_setting", resource_id=key,
            previous_value={"value": before}, new_value={"value": setting.value}, request=request,
        )
        return Response(StoreSettingSerializer(setting).data)
