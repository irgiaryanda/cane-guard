<div align="center">

# 🌱 Cane Guard

**Web-Based Plantation GIS Monitoring & Incident Response System**

A production-ready, mobile-first GIS operational tracking and incident response platform designed for sugarcane estate management.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS-199900?logo=leaflet)](https://leafletjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## Overview

Sugarcane plantations face fast-spreading crop threats — fires, pest infestations, crop diseases, and waterlogging — that demand rapid field reporting and spatial hotspot detection. Traditional reporting chains are too slow and lack geospatial context for management decisions.

**Cane Guard** solves this by empowering field workers to instantly report incidents from their mobile devices with one-tap GPS tagging and automatic photo compression, while estate management monitors real-time situations on an interactive GIS command dashboard with marker clustering and radius-based geographic queries.

---

## Core Features

### 📍 Precision Geolocation & Field Capture
- HTML5 Geolocation API with automatic high-accuracy → low-accuracy fallback for Android devices
- Interactive mini-map for manual pin adjustment via click or drag
- Camera capture with automatic client-side WebP compression (sub-500KB) for fast uploads on 3G field networks

### 🗺️ Interactive GIS & Hotspot Analysis
- SSR-safe Leaflet engine with OpenStreetMap tile layer
- Category-colored custom SVG markers (🔥 Fire, 🐛 Pest, 🦠 Disease, 💧 Flooding, ⚠️ Other)
- Dynamic spatial clustering via `leaflet.markercluster` that aggregates dense incident points into hotspot clusters when zooming out
- Radius-based geographic queries (1–100 km) with Haversine distance calculation
- Category and status filtering on the map view

### ⚡ Real-Time Lifecycle Management
- Full incident lifecycle progression: `OPEN` → `ON_PROGRESS` → `CLOSED`
- Inline table status mutations with instant local state update
- Map popup quick-action buttons for status changes without leaving the map
- Real-time Supabase PostgreSQL subscriptions for live data updates

### 📊 Executive Monitoring Console
- Dark-mode telemetry dashboard with Geist Sans typography
- Metric summary cards (Total Incidents, Active Hotspots, In-Progress, Resolved)
- Category distribution visualization with horizontal progress bars
- Filterable data table with category, status, and date range controls

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16+ (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4, shadcn/ui, Lucide Icons |
| **Maps & GIS** | Leaflet, React-Leaflet, Leaflet MarkerCluster |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **Image Processing** | Client-side compression via `browser-image-compression` |
| **Deployment** | Vercel (Production-ready) |

---

## Architecture

```
src/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout (dark theme, Geist Sans)
│   ├── page.tsx                 # Public incident reporting form
│   ├── report/success/          # Post-submission confirmation
│   ├── dashboard/
│   │   ├── layout.tsx           # Sidebar layout (auth-guarded)
│   │   ├── page.tsx             # Executive dashboard with metrics
│   │   └── map/page.tsx         # Full-screen GIS map view
│   └── api/                     # Server API routes
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── shared/
│   │   ├── sidebar.tsx          # Persistent sidebar navigation
│   │   └── header.tsx           # Navbar (legacy, phase-out)
│   ├── maps/
│   │   ├── dynamic-map.tsx      # SSR-safe Leaflet wrapper
│   │   ├── incident-map.tsx     # Main map with clustering & popups
│   │   ├── mini-map.tsx         # Form location picker
│   │   ├── dynamic-mini-map.tsx # SSR-safe mini-map wrapper
│   │   ├── gis-search.tsx       # Coordinate & radius search panel
│   │   └── map-props.ts         # Shared map TypeScript interfaces
│   ├── reports/
│   │   ├── incident-form.tsx    # Multi-step wizard reporting form
│   │   ├── photo-capture.tsx    # Camera capture + compression
│   │   └── gps-button.tsx       # One-tap GPS location fetcher
│   └── dashboard/
│       ├── metric-cards.tsx     # Summary stat cards
│       ├── category-chart.tsx   # Category distribution bars
│       ├── incident-table.tsx   # Filterable data table
│       └── status-badge.tsx     # Status indicator pills
├── hooks/
│   ├── use-geolocation.ts       # GPS hook with fallback
│   └── use-incidents.ts         # Data fetching + realtime subscriptions
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   ├── server.ts            # Server Supabase client
│   │   └── middleware.ts        # Session refresh middleware
│   ├── constants.ts             # Categories, statuses, colors
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── middleware.ts                 # Next.js route middleware

supabase/
└── schema.sql                   # Complete DDL, enums, RLS, storage
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/irgiaryanda/cane-guard.git
cd cane-guard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file at the project root:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Set up the database

1. Go to your Supabase project dashboard → **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and execute the entire script
4. This creates: `incidents` table, enum types, indexes, triggers, RLS policies, and Storage bucket

### 5. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Production Deployment

### Vercel

1. Push your repository to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Configure the environment variables in Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel will automatically detect Next.js and configure the build

### Supabase Storage Setup

The bucket `incident-reports` is created automatically by the schema SQL. Ensure the bucket is set to **public** in your Supabase Storage dashboard if not already configured by the SQL script.

---

## Database Schema

The `incidents` table uses PostgreSQL enums and automatic timestamp management:

```sql
-- Enum types
incident_category: FIRE | PEST | DISEASE | FLOODING | OTHER
incident_status:   OPEN | ON_PROGRESS | CLOSED

-- Table columns
id            uuid          PRIMARY KEY
category      incident_category NOT NULL
description   text          NOT NULL
reporter_name text          (nullable)
reporter_note text          (nullable)
latitude      double precision NOT NULL
longitude     double precision NOT NULL
photo_path    text          (nullable)
photo_url     text          (nullable)
status        incident_status DEFAULT 'OPEN'
created_at    timestamptz   DEFAULT now()
updated_at    timestamptz   DEFAULT now() — auto-updated via trigger
```

Row Level Security (RLS) policies allow:
- **Public INSERT**: Anyone can submit incident reports
- **Public SELECT**: Anyone can view incidents
- **Public UPDATE**: Status changes without authentication (demo mode)
- **Authenticated DELETE**: Admin-only cleanup

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Dynamic `ssr: false` for all map components | Leaflet requires browser `window` object |
| Client-side image compression | Reduces upload payload from 3–8MB to under 500KB for field networks |
| GPS high-accuracy fallback | Automatically retries low-accuracy on Android devices that fail high-accuracy |
| Inline styles for map popups | Tailwind CSS does not penetrate Leaflet's isolated DOM layer |
| `useRef` for stable callbacks | Prevents Leaflet re-render loops when parent state updates |
| Global Leaflet CSS imports | Ensures consistent marker styling in production builds |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
  Built for real-world plantation operations
</div>
