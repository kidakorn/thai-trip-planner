import { z } from "zod";

// =====================
// Enums
// =====================

export const CATEGORIES = ["food", "drink", "hotel", "activity", "attraction"] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRICE_RANGES = [1, 2, 3] as const;
export type PriceRange = (typeof PRICE_RANGES)[number];

export const TRIP_STYLES = ["culture", "nature", "food", "nightlife", "relaxation"] as const;
export type TripStyle = (typeof TRIP_STYLES)[number];

// =====================
// Database Types
// =====================

export interface Place {
  id: string;
  name: string;
  name_en: string | null;
  category: Category;
  province: string;
  district: string | null;
  address: string | null;
  lat: number;
  lng: number;
  price_range: PriceRange | null;
  vibe: string[];
  open_hours: Record<string, string>;
  description: string | null;
  description_en: string | null;
  images: string[];
  affiliate_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Trip {
  id: string;
  province: string;
  days: number;
  budget: number;
  travelers: number;
  style: TripStyle[];
  preferences: string | null;
  plan: TripPlan;
  view_count: number;
  created_at: string;
}

// =====================
// AI / Plan Types
// =====================

export interface Activity {
  time: string;
  place_name: string;
  place_id: string | null;
  category: Category;
  description: string;
  duration_minutes: number;
  estimated_cost: number;
  tip: string;
  lat: number | null;
  lng: number | null;
  affiliate_url: string | null;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  total_cost: number;
}

export interface TripPlan {
  title: string;
  summary: string;
  days: DayPlan[];
  total_budget: number;
  tips: string[];
}

// =====================
// Request Types
// =====================

export interface TripRequest {
  province?: string;
  days: number;
  budget: number;
  travelers: number;
  style: TripStyle[];
  preferences?: string;
}

// =====================
// Zod Schemas for API Validation
// =====================

export const TripRequestSchema = z.object({
  province: z.string().optional(),
  days: z.number().int().min(1).max(14),
  budget: z.number().int().min(500),
  travelers: z.number().int().min(1).max(20),
  style: z.array(z.enum(TRIP_STYLES)).min(1, "Select at least one style"),
  preferences: z.string().max(500).optional(),
});

export const PlaceSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().optional(),
  category: z.enum(CATEGORIES),
  province: z.string().min(1),
  district: z.string().optional(),
  address: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  price_range: z.number().int().min(1).max(3).optional(),
  vibe: z.array(z.string()).optional(),
  open_hours: z.record(z.string()).optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  images: z.array(z.string()).optional(),
  affiliate_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().optional(),
});

export type PlaceInput = z.infer<typeof PlaceSchema>;

// =====================
// Zod Schema for AI response validation
// =====================

export const ActivitySchema = z.object({
  time: z.string(),
  place_name: z.string(),
  place_id: z.string().nullable(),
  category: z.enum(CATEGORIES),
  description: z.string(),
  duration_minutes: z.number(),
  estimated_cost: z.number(),
  tip: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  affiliate_url: z.string().nullable(),
});

export const DayPlanSchema = z.object({
  day: z.number(),
  title: z.string(),
  activities: z.array(ActivitySchema),
  total_cost: z.number(),
});

export const TripPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.array(DayPlanSchema),
  total_budget: z.number(),
  tips: z.array(z.string()),
});
