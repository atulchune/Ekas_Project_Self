from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NewsletterSubscriber
from .serializers import ContactEnquirySerializer, NewsletterSubscribeSerializer
from .tasks import send_enquiry_acknowledgement


class NewsletterSubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").lower().strip()
        serializer = NewsletterSubscribeSerializer(data={"email": email, "source": request.data.get("source", "footer")})
        serializer.is_valid(raise_exception=True)
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email, defaults={"source": serializer.validated_data.get("source", "footer")}
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.unsubscribed_at = None
            subscriber.save(update_fields=["is_active", "unsubscribed_at"])
        return Response({"status": "subscribed"}, status=status.HTTP_201_CREATED)


class NewsletterUnsubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from django.utils import timezone

        email = request.data.get("email", "").lower().strip()
        NewsletterSubscriber.objects.filter(email=email).update(is_active=False, unsubscribed_at=timezone.now())
        return Response({"status": "unsubscribed"})


class ContactEnquiryView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = ContactEnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry = serializer.save()
        send_enquiry_acknowledgement.delay(enquiry_id=str(enquiry.id))
        return Response(serializer.data, status=status.HTTP_201_CREATED)
