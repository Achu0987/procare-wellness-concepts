# ProCare Wellness Institute: homepage concepts

Homepage concept prototypes for ProCare Wellness Institute (Savannah, GA), built for discussion.

- `/concept-1/`: Premium medical authority, a cinematic scroll homepage.
- Concepts 2 and 3: in progress.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3100
```

## Deploy

Every push to `main` builds a static export and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). The workflow sets `NEXT_PUBLIC_BASE_PATH` so assets resolve under the repository path.

Stack: Next.js, React, TypeScript, Tailwind CSS, GSAP (ScrollTrigger, SplitText), Lenis, React Three Fiber, Motion.

Clinical photographs are Unsplash stand-ins for ProCare's own photography. See the footer of each concept for credits.
