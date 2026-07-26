from django.db.models import Prefetch, Q
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import ProductFilter
from .models import Bundle, Category, Product, ProductVariant
from .serializers import (
    BundleSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("display_order", "name")


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ["name", "short_description", "ingredients"]
    ordering_fields = ["created_at", "average_rating", "name"]

    def get_queryset(self):
        qs = Product.objects.filter(status=Product.PUBLISHED).select_related("category").prefetch_related(
            "variants", "variants__inventory", "images",
        )
        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=["get"])
    def suggestions(self, request):
        q = request.query_params.get("q", "").strip()
        if len(q) < 2:
            return Response([])
        products = self.get_queryset().filter(name__icontains=q)[:8]
        return Response(ProductListSerializer(products, many=True, context={"request": request}).data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        return self._flagged(request, is_featured=True)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        return self._flagged(request, is_bestseller=True)

    @action(detail=False, methods=["get"])
    def new_launches(self, request):
        return self._flagged(request, is_new_launch=True)

    def _flagged(self, request, **flags):
        qs = self.get_queryset().filter(**flags)
        page = self.paginate_queryset(qs)
        serializer = ProductListSerializer(page or qs, many=True, context={"request": request})
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class BundleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = BundleSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Bundle.objects.filter(status=Bundle.PUBLISHED, is_active=True).prefetch_related(
            "items", "items__variant", "items__variant__product"
        )
