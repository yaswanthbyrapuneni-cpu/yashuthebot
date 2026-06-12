## 1. Abstract and Purpose of Software

Project: Virtual Jewelry Try-On System

Version: 1.2.0

Purpose: This Single Page Application (SPA) provides a real-time virtual jewelry try-on experience using webcam-based face tracking, AI-assisted placement, and product catalog browsing. The primary submission purpose is Intellectual Property Registration with NRDC.

--

## 2. System Architecture and Modules

High-level architecture:

- Frontend SPA (React + TypeScript) — code in `src/`
- Serverless edge functions (Supabase / Deno) — code in `supabase/functions/`
- Data store: Supabase (Postgres)
- Static assets: `public/` and `src/assets/`

Primary modules and representative file locations:

- Application entry: `src/main.tsx`, `src/App.tsx`
- Try-on UI: `src/components/VirtualTryOn.tsx`, `src/components/SnapWebAR.tsx`, `src/components/MultiProductTryOn.tsx`
- Face & camera detection: `src/hooks/useFaceTracking.ts`, `src/utils/faceDetection.ts`
- Positioning & placement logic: `src/utils/jewelry-positioner.ts`, `src/detectors/DetectorManager.ts`
- Visitor & analytics tracking (client): `src/utils/visitor-tracking.ts`, `src/hooks/useAnalytics.ts`
- Supabase integrations (client): `src/integrations/supabase/client.ts`, serverless: `supabase/functions/*`
- UI library & primitives: `src/components/ui/*` (custom wrappers and compositions using Radix UI)

Data flow (simplified):

1. User opens site -> React SPA initialises.
2. `useFaceTracking` loads MediaPipe/TensorFlow models and obtains landmarks.
3. `jewelry-positioner` and relevant try-on components compute placement transforms and render assets on camera overlay.
4. Client invokes Supabase functions (e.g., `track-visitor`, `track-try-on`) to store visitor analytics and try-on events.

--

## 3. Functional Description

Key features (user-facing):

- Real-time jewelry try-on for multiple product types (earrings, necklaces, nose pin, bangles).
- Multi-product placement and composition (e.g., layered necklaces).
- Smart kiosk and inactivity ad features (InactivityAd, IdleAd components).
- Search and product detail pages; image fallbacks and responsive layouts.

Back-end features:

- Visitor tracking and analytics via Supabase edge functions.
- Video/shopping details endpoint and analytics aggregation functions.

--

## 4. Source Code Metadata and Originality

Repository structure highlights:

- `src/`: primary application source (TS/TSX). These files contain the majority of application-specific logic and UI.
- `supabase/functions/`: serverless endpoints implemented in TypeScript (Deno) that persist analytic events to Supabase Postgres.
- `public/config/products.json`: product catalog used by the UI.

Representative original code excerpts (redacted for privacy and secrets):

- Visitor ID generation (from `src/utils/visitor-tracking.ts`):

```ts
export function generateVisitorId(): string {
  const existingId = localStorage.getItem('visitor_id');
  if (existingId) return existingId;

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  const visitorId = 'visitor_' + btoa(fingerprint).slice(0, 32) + '_' + Date.now();
  localStorage.setItem('visitor_id', visitorId);
  return visitorId;
}
```

Notes on originality:

- The SPA source under `src/` appears to be primarily authored for this project (UI composition, try-on placement, hooks and custom utilities). These are original code assets suitable for registration.
- The project integrates many third-party libraries (React, RadixUI, TensorFlow.js, MediaPipe, Supabase). Those libraries are not original to the applicant and must be identified and credited in any submission. Do not claim third-party source code as original.

Third-party components requiring attention:

- All dependencies listed in `package.json` (please attach `node_modules` license artefacts or `yarn.lock`/`package-lock.json` with resolved versions for thorough license auditing).
- Supabase edge functions import code from Deno/esm CDNs; preserve these import URLs in submission and note their origin.

--

## 5. Author and Ownership Declaration

Applicant: <APPLICANT_FULL_NAME>  <-- Replace with the applicant's full legal name before submission.

Organization: NRDC (per user request)

Declaration (suggested wording):

"I, <APPLICANT_FULL_NAME>, hereby declare that the original source code contained in the folder `src/` and the serverless functions in `supabase/functions/` are my original work or that I hold the necessary rights to submit them for copyright registration with NRDC. This submission excludes third-party libraries and assets, which are listed and referenced separately."

--

Attachments recommended for NRDC submission:

1. A ZIP of the original source files (only applicant-authored files in `src/` and `supabase/functions`) with directory tree preserved.
2. The `code_audit_summary.json`, `nrdc_guideline_compliance.json`, and `originality_statement.txt` (these documents).
3. A list of third-party dependencies and their LICENSE files (or pointers to their repositories and license texts).
4. A signed author declaration and contact information.

Confidentiality note: This central document redacts any sensitive environment keys and should be reviewed to remove any additional secrets before external submission.
