import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    min_price = django_filters.NumberFilter(field_name="variants__price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="variants__price", lookup_expr="lte")
    size = django_filters.CharFilter(field_name="variants__label", lookup_expr="iexact")
    in_stock = django_filters.BooleanFilter(method="filter_in_stock")
    featured = django_filters.BooleanFilter(field_name="is_featured")
    bestseller = django_filters.BooleanFilter(field_name="is_bestseller")
    new_launch = django_filters.BooleanFilter(field_name="is_new_launch")

    class Meta:
        model = Product
        fields = ["category", "min_price", "max_price", "size", "in_stock", "featured", "bestseller", "new_launch"]

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(variants__inventory__available_quantity__gt=0).distinct()
        return queryset.filter(variants__inventory__available_quantity__lte=0).distinct()
