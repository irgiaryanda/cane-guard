# Cane Guard — Architecture

## Overview
GIS monitoring and incident reporting application for sugarcane plantation operations. Field workers report incidents via mobile; estate management monitors via authenticated dashboard.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4, shadcn/ui, Lucide React icons
- **Maps**: Leaflet, react-leaflet, leaflet.markercluster
- **Database/Auth/Storage**: Supabase (@supabase/supabase-js, @supabase/ssr)
- **Image Processing**: browser-image-compression
- **Deployment**: Vercel

## Route Structure
```
src/app/
├── layout.tsx              # Root layout, fonts, metadata
├── page.tsx                # Public incident reporting form
├── report/success/
│   └── page.tsx            # Post-submission confirmation
├── dashboard/
│   ├── layout.tsx          # Auth guard for admin/manager
│   ├── page.tsx            # Dashboard metrics + data table
│   └── map/page.tsx        # Full interactive GIS map view
└── api/
    └── incidents/
        ├── route.ts        # GET (list), POST (create)
        └── [id]/
            └── route.ts    # PATCH (status update)
```

## Component Hierarchy
```
src/
├── app/                    # Route pages
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── maps/
│   │   ├── dynamic-map.tsx     # next/dynamic wrapper (ssr: false)
│   │   ├── incident-map.tsx    # Core MapContainer + tiles + markers
│   │   ├── mini-map.tsx        # Compact map for report form preview
│   │   └── map-marker.tsx      # Category-colored custom markers
│   ├── reports/
│   │   ├── incident-form.tsx   # Full reporting form
│   │   ├── category-select.tsx # Event category dropdown
│   │   ├── photo-capture.tsx   # Camera/file upload + compression
│   │   └── gps-button.tsx      # One-tap geolocation fetch
│   ├── dashboard/
│   │   ├── metric-cards.tsx    # Summary stat cards
│   │   ├── category-chart.tsx  # Category distribution chart
│   │   ├── incident-table.tsx  # Filterable data table
│   │   └── status-badge.tsx    # Visual status indicator
│   └── shared/
│       ├── header.tsx          # App header/navbar
│       └── toast-provider.tsx  # Toast notification provider
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client (cookies)
│   │   └── middleware.ts       # Auth middleware helper
│   ├── constants.ts            # Categories, statuses, colors
│   └── utils.ts                # Shared utility functions
└── hooks/
    ├── use-geolocation.ts      # Geolocation API hook
    └── use-incidents.ts        # Data fetching hooks
```

## Database Schema (Supabase PostgreSQL)

### Enums
```sql
CREATE TYPE incident_category AS ENUM (
  'FIRE', 'PEST', 'DISEASE', 'FLOODING', 'OTHER'
);

CREATE TYPE incident_status AS ENUM (
  'OPEN', 'ON_PROGRESS', 'CLOSED'
);
```

### Table: incidents
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| category | incident_category | NOT NULL |
| description | text | NOT NULL |
| reporter_name | text | Optional identifier |
| reporter_note | text | Optional notes |
| latitude | double precision | NOT NULL, validated -11..6 |
| longitude | double precision | NOT NULL, validated 95..141 |
| photo_path | text | Storage bucket path |
| photo_url | text | Public URL after upload |
| status | incident_status | Default OPEN |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

### Indexes
- `idx_incidents_created_at` ON created_at DESC
- `idx_incidents_status` ON status
- `idx_incidents_category` ON category

## Supabase Storage
- **Bucket**: `incident-reports` (public)
- **Path format**: `incidents/{uuid}/{timestamp}-{random}.{ext}`
- **Policy**: Public read, authenticated insert/delete

## RLS Policies
- **Public insert**: Anyone can INSERT into incidents (for field reporting)
- **Public read**: Anyone can SELECT incidents (map + dashboard are public-facing management view with Supabase Auth gate at Next.js level)
- **Authenticated update**: Only authenticated users can UPDATE status
- **Authenticated delete**: Only authenticated users can DELETE incidents

## Map Strategy
- All Leaflet components loaded via `next/dynamic({ ssr: false })`
- `react-leaflet-cluster` aggregates markers by radius/zoom
- Category-specific marker colors (FIRE=red, PEST=amber, DISEASE=purple, FLOODING=blue, OTHER=gray)
- Marker popups show photo, metadata, status badge, quick status action

## Mobile-First Considerations
- Single-column form layout on mobile
- Touch-friendly targets minimum 44px
- Camera capture with `capture="environment"` attribute
- Client-side compression to <500KB before upload
- Mini-map with adequate height for touch interaction
- Keyboard push handled via safe-area-inset and scroll management
