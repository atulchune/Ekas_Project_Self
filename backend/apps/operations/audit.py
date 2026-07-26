from .models import AuditLog


def log_action(*, staff, action, resource_type, resource_id="", previous_value=None, new_value=None, request=None):
    ip_address = None
    user_agent = ""
    request_id = ""
    if request is not None:
        ip_address = (request.META.get("HTTP_X_FORWARDED_FOR") or request.META.get("REMOTE_ADDR", ""))[:45] or None
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:255]
        request_id = getattr(request, "request_id", "")
    return AuditLog.objects.create(
        staff=staff,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id),
        previous_value=previous_value or {},
        new_value=new_value or {},
        request_id=request_id,
        ip_address=ip_address,
        user_agent=user_agent,
    )
