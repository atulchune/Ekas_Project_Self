import { serverFetch } from "./serverFetch";
import { BackendCategory, BackendProductDetail, BackendProductListItem, PaginatedResponse, ProductListParams } from "./types";
import { toQueryString } from "./queryString";

export function getCategories(): Promise<BackendCategory[]> {
  return serverFetch<BackendCategory[]>("/categories");
}

export function getProducts(params: ProductListParams = {}): Promise<PaginatedResponse<BackendProductListItem>> {
  return serverFetch<PaginatedResponse<BackendProductListItem>>(`/products${toQueryString(params)}`);
}

export function getProductBySlug(slug: string): Promise<BackendProductDetail> {
  return serverFetch<BackendProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

export async function getFeaturedProducts(): Promise<BackendProductListItem[]> {
  const res = await serverFetch<PaginatedResponse<BackendProductListItem>>("/products/featured");
  return res.results;
}

export async function getBestsellers(): Promise<BackendProductListItem[]> {
  const res = await serverFetch<PaginatedResponse<BackendProductListItem>>("/products/bestsellers");
  return res.results;
}

export async function getNewLaunches(): Promise<BackendProductListItem[]> {
  const res = await serverFetch<PaginatedResponse<BackendProductListItem>>("/products/new_launches");
  return res.results;
}
