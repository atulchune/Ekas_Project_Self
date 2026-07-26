from django.urls import path

from .views import MockSimulatePaymentView, RazorpayWebhookView, VerifyPaymentView

urlpatterns = [
    path("payments/verify/", VerifyPaymentView.as_view(), name="payment-verify"),
    path("payments/mock/simulate/", MockSimulatePaymentView.as_view(), name="payment-mock-simulate"),
    path("payments/webhook/razorpay/", RazorpayWebhookView.as_view(), name="payment-webhook-razorpay"),
]
