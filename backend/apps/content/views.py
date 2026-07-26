from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BlogPost, HomepageSection, Recipe, SiteAnnouncement, StaticPage
from .serializers import (
    BlogDetailSerializer,
    BlogListSerializer,
    HomepageSectionSerializer,
    RecipeDetailSerializer,
    RecipeListSerializer,
    SiteAnnouncementSerializer,
    StaticPageSerializer,
)


class HomepageContentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        now = timezone.now()
        sections = HomepageSection.objects.filter(status=HomepageSection.PUBLISHED, is_visible=True).filter(
            models_q_schedule(now)
        ).order_by("display_order")
        announcements = SiteAnnouncement.objects.filter(is_active=True).filter(models_q_schedule_announcement(now))
        return Response(
            {
                "sections": HomepageSectionSerializer(sections, many=True, context={"request": request}).data,
                "announcements": SiteAnnouncementSerializer(announcements, many=True).data,
            }
        )


def models_q_schedule(now):
    from django.db.models import Q

    return (Q(publish_at__isnull=True) | Q(publish_at__lte=now))


def models_q_schedule_announcement(now):
    from django.db.models import Q

    return (Q(starts_at__isnull=True) | Q(starts_at__lte=now)) & (Q(ends_at__isnull=True) | Q(ends_at__gte=now))


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Recipe.objects.filter(status=Recipe.PUBLISHED).prefetch_related("ingredients", "ekas_products")

    def get_serializer_class(self):
        return RecipeDetailSerializer if self.action == "retrieve" else RecipeListSerializer


class BlogViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return BlogPost.objects.filter(status=BlogPost.PUBLISHED)

    def get_serializer_class(self):
        return BlogDetailSerializer if self.action == "retrieve" else BlogListSerializer


class StaticPageView(RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = StaticPageSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return StaticPage.objects.filter(is_published=True)
