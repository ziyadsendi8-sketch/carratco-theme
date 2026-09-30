import { useQuery } from '@tanstack/react-query';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import type { Product } from '@salla.sa/twilight-theme-engine/types';

/** Every product in the store (the catalogue is small — one page covers it). */
export function useStones() {
  const q = useQuery(productApi.queries.list({ source: 'latest', perPage: 60 }));
  const items: Product[] = (q.data?.items as Product[]) ?? [];
  return { products: items, isLoading: q.isLoading };
}
