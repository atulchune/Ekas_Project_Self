from django.core.cache import cache

CATALOG_VERSION_KEY = "catalog:version"


def get_catalog_version():
    version = cache.get(CATALOG_VERSION_KEY)
    if version is None:
        version = 1
        cache.set(CATALOG_VERSION_KEY, version, timeout=None)
    return version


def bump_catalog_version():
    try:
        cache.incr(CATALOG_VERSION_KEY)
    except ValueError:
        cache.set(CATALOG_VERSION_KEY, 1, timeout=None)
