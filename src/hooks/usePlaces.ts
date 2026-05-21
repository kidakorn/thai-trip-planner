"use client";

import useSWR from "swr";
import { Place, Category } from "@/src/lib/types";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch places");
    return res.json();
  });

interface UsePlacesOptions {
  province?: string;
  category?: Category | "all";
}

interface UsePlacesResult {
  places: Place[];
  isLoading: boolean;
  error: Error | undefined;
}

export function usePlaces({ province, category }: UsePlacesOptions = {}): UsePlacesResult {
  const params = new URLSearchParams();

  if (province) params.set("province", province);
  if (category && category !== "all") params.set("category", category);

  const key = `/api/places?${params.toString()}`;
  const { data, error, isLoading } = useSWR<Place[]>(key, fetcher);

  return {
    places: data ?? [],
    isLoading,
    error,
  };
}
