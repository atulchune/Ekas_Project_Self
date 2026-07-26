from django.urls import path

from .views import ContactEnquiryView, NewsletterSubscribeView, NewsletterUnsubscribeView

urlpatterns = [
    path("newsletter/subscribe/", NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
    path("newsletter/unsubscribe/", NewsletterUnsubscribeView.as_view(), name="newsletter-unsubscribe"),
    path("contact/", ContactEnquiryView.as_view(), name="contact-enquiry"),
]
