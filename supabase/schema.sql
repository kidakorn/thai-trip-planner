-- =====================================================
-- Thai Trip Planner — Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor dashboard.
-- DO NOT run this automatically — apply manually.
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- Table: places
-- =====================
create table places (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  name_en       text,
  category      text not null check (
                  category in ('food', 'drink', 'hotel', 'activity', 'attraction')
                ),
  province      text not null,
  district      text,
  address       text,
  lat           float not null,
  lng           float not null,
  price_range   int check (price_range in (1, 2, 3)),
  vibe          text[] default '{}',
  open_hours    jsonb default '{}',
  description   text,
  description_en text,
  images        text[] default '{}',
  affiliate_url text,
  is_published  boolean default true,
  created_at    timestamp default now()
);

-- =====================
-- Table: trips
-- =====================
create table trips (
  id          uuid default uuid_generate_v4() primary key,
  province    text not null,
  days        int not null,
  budget      int not null,
  travelers   int default 1,
  style       text[] default '{}',
  preferences text,
  plan        jsonb not null,
  view_count  int default 0,
  created_at  timestamp default now()
);

-- =====================
-- Indexes
-- =====================
create index idx_places_province  on places(province);
create index idx_places_category  on places(category);
create index idx_places_published on places(is_published);
create index idx_trips_province   on trips(province);
create index idx_trips_created_at on trips(created_at desc);
