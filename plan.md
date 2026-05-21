# Thai Trip Planner — Project Plan

## Project Overview
An all-in-one web application for planning trips in Thailand, covering accommodations, attractions, dining, nightlife, and activities. It utilizes AI to generate personalized trip itineraries based on user preferences and supports both Thai and English languages.

---

## Google Cloud — Utilizing GenAI App Builder Credit Only

| Credit | Value | Expiration Date | Usage |
|---|---|---|---|
| Trial credit for GenAI App Builder | ฿31,090.50 | March 9, 2027 | Gemini API only |

### Services Used from this Credit
- **Gemini 1.5 Flash API** — Generate trip plans from user prompts
- **No Google Maps API** — Using Leaflet.js (100% free) instead
- **No Cloud Storage** — Using Supabase Storage (free) instead

### Estimated Gemini API Costs
- Gemini 1.5 Flash costs ~$0.075 per 1M input tokens
- 1 trip plan uses approximately 2,000–3,000 tokens
- ฿31,090 ≈ $880 → Can support approximately **200,000+ trip plans**
- More than enough to comfortably last the entire 10 months.

---

## Tech Stack (Free except Gemini)

| Part | Tool | Cost |
|---|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS | Free |
| Database | Supabase (PostgreSQL) | Free |
| File Storage | Supabase Storage | Free |
| AI | Gemini 1.5 Flash API | **Using Available Credit** |
| Map | Leaflet.js + OpenStreetMap | Free |
| Deploy | Vercel | Free |
| Domain | Namecheap .com | ~฿350/year |

---

## Project Structure

```
thai-trip-planner/
├── src/
│   ├── app/
│   │   ├── page.tsx                  ← Home Page
│   │   ├── plan/
│   │   │   └── page.tsx              ← Trip Planning Form
│   │   ├── trip/
│   │   │   └── [id]/
│   │   │       └── page.tsx          ← Trip Results + Share Link
│   │   ├── places/
│   │   │   ├── page.tsx              ← List of All Places
│   │   │   └── [id]/
│   │   │       └── page.tsx          ← Detailed Place Reviews
│   │   ├── admin/
│   │   │   └── places/
│   │   │       └── page.tsx          ← Add/Edit Places
│   │   └── api/
│   │       ├── plan/
│   │       │   └── route.ts          ← Call Gemini API
│   │       └── places/
│   │           └── route.ts          ← CRUD Places
│   ├── components/
│   │   ├── PlanForm.tsx              ← Trip Planning Form
│   │   ├── TripResult.tsx            ← Trip Results
│   │   ├── MapView.tsx               ← Leaflet Map
│   │   ├── PlaceCard.tsx             ← Place Card
│   │   ├── ShareButton.tsx           ← Share Button
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── supabase.ts               ← Supabase client
│   │   ├── gemini.ts                 ← Gemini API client
│   │   └── types.ts                  ← TypeScript types
│   └── hooks/
│       └── usePlaces.ts
├── .env.local
└── package.json
```

---

## Database Schema (Supabase)

```sql
-- Enable UUID
create extension if not exists "uuid-ossp";

-- =====================
-- Table: places
-- =====================
create table places (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  name_en      text,
  category     text not null check (
                 category in ('food', 'drink', 'hotel', 'activity', 'attraction')
               ),
  province     text not null,
  district     text,
  address      text,
  lat          float not null,
  lng          float not null,
  price_range  int check (price_range in (1, 2, 3)),
  vibe         text[] default '{}',
  open_hours   jsonb default '{}',
  description  text,
  description_en text,
  images       text[] default '{}',
  affiliate_url text,
  is_published boolean default true,
  created_at   timestamp default now()
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

-- Index
create index idx_places_province on places(province);
create index idx_places_category on places(category);
```

---

## Using Gemini API

```typescript
// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateTripPlan(request, places) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are a Thai travel expert. Plan a trip according to the following requirements:
- Province: ${request.province}
- Duration: ${request.days} days
- Budget: ${request.budget} THB / ${request.travelers} people
- Style: ${request.style.join(', ')}
- Preferences: ${request.preferences || 'None'}

Places in the system:
${JSON.stringify(places)}

Respond in JSON format only:
{
  "title": "Trip Title",
  "summary": "Summary in Thai",
  "days": [{
    "day": 1,
    "title": "Day 1 Title",
    "activities": [{
      "time": "08:00",
      "place_name": "Place Name",
      "place_id": "uuid or null",
      "category": "food/drink/hotel/activity/attraction",
      "description": "Description in Thai",
      "duration_minutes": 60,
      "estimated_cost": 200,
      "tip": "Tip in Thai",
      "lat": 19.9105,
      "lng": 99.8406,
      "affiliate_url": "Link or null"
    }],
    "total_cost": 1000
  }],
  "total_budget": 3000,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
`
  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json|```/g, '').trim()
  return JSON.parse(text)
}
```

---

## Using Leaflet (100% Free)

```bash
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet
```

```tsx
// src/components/MapView.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapView({ activities }) {
  const center = activities[0] 
    ? [activities[0].lat, activities[0].lng] 
    : [13.7563, 100.5018]

  return (
    <MapContainer center={center} zoom={13} className="w-full h-96 rounded-xl z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {activities.filter(a => a.lat && a.lng).map((a, i) => (
        <Marker key={i} position={[a.lat, a.lng]}>
          <Popup>
            <strong>{a.place_name}</strong><br />
            {a.description}<br />
            {a.estimated_cost} Baht
            {a.affiliate_url && (
              <><br /><a href={a.affiliate_url} target="_blank">Book Accommodation →</a></>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

---

## Revenue Plan (User Pays Nothing)

| Channel | How It Works | Expected Revenue |
|---|---|---|
| Agoda Affiliate | Affiliate links in trip plans (4–8% commission) | Depends on bookings |
| Klook Affiliate | Affiliate links for tours/activities (5–10% commission) | Depends on bookings |
| Google AdSense | โฆษณาในหน้ารีวิวและบทความ | ตาม traffic |

**สมัคร Affiliate:**
- Agoda: partners.agoda.com
- Klook: affiliate.klook.com
- AdSense: adsense.google.com

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini (Google Cloud — ใช้ GenAI App Builder Credit)
GEMINI_API_KEY=

# Admin password
ADMIN_SECRET=
```

## Language on web

```typescript
const lang = {
  th: {
    
  },
  en: {

  },
  
}