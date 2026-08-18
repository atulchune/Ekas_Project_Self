"use client";

import { clientFetch } from "./clientFetch";
import { BackendCategory, BackendProductDetail, BackendProductListItem, PaginatedResponse, ProductListParams } from "./types";
import { toQueryString } from "./queryString";

export function getCategoriesClient(): Promise<BackendCategory[]> {
  return clientFetch<BackendCategory[]>("/categories");
}

export function getProductsClient(params: ProductListParams = {}): Promise<PaginatedResponse<BackendProductListItem>> {
  return clientFetch<PaginatedResponse<BackendProductListItem>>(`/products${toQueryString(params)}`);
}

export function getProductBySlugClient(slug: string): Promise<BackendProductDetail> {
  return clientFetch<BackendProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

export function getProductSuggestions(query: string): Promise<BackendProductListItem[]> {
  return clientFetch<BackendProductListItem[]>(`/products/suggestions${toQueryString({ q: query })}`);
}
