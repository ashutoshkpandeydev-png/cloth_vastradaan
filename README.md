# Cloth Forward 🌿
> **"Give good clothes a second life."**  
> Connecting unused wardrobes directly to people who need them most with dignity, transparency, and community trust.

---

## 🌟 Overview
**Cloth Forward** is a full-stack, community-driven clothing reuse web platform built for Indian urban communities (Pune, Mumbai, Bengaluru, Delhi, Hyderabad, Chennai, Kolkata). It enables donors to list clean pre-loved garments and seekers to discover, request, and arrange safe public handovers—without commercial middle-men, hidden fees, or privacy leaks.

### Key Capabilities
- **3D Interactive Motion & Aesthetics:** Framer Motion 3D perspective tilt cards with realistic glare, editorial hero collage, responsive layouts, and celebration confetti.
- **Smart Category Fallback System:** Rich, category-specific SVG vector illustrations rendered dynamically on image load errors so no broken cards ever appear.
- **Multi-Step Giving Wizard (`/give`):**
  1. Photo upload + instant sample wardrobe presets.
  2. Detailed garment attributes (size, condition, color, brand, why giving).
  3. Location selection with zero public address exposure.
  4. Live interactive card review.
  5. Published celebration screen.
- **Request & Handover Lifecycle (`/activity`):**
  - Seeker sends item request with optional message and community pledge.
  - Donor reviews requests, approves with specific public meeting coordinates (e.g. Metro station ticket counter).
  - Status updates: `Requested` ➔ `Approved` ➔ `Handover Arranged` ➔ `Completed`.
- **Faceted Discovery Engine (`/discover`):**
  - Search across title, brand, description, and area.
  - Multi-category pills (Kurtis, Sarees, Jeans, Jackets, Shirts, Kidswear, Footwear, etc.).
  - Size filters, condition pills, gender/fit, city filters, and active chip reset.
- **Interactive Impact Analytics (`/impact`):**
  - Real-time circularity calculator (dynamic slider computing water conserved, CO₂ avoided, and landfill waste diverted).
  - Transparent methodology sourced from standard textile lifecycle benchmarks (WRAP & Water Footprint Network).
- **Admin Moderation Console (`/admin`):**
  - Key platform KPIs (Listings, Requests, Active members, Handovers).
  - Recharts visual charts for city distributions and category shares.
  - Moderation tables to hide/restore listings and resolve community safety flags.
  - 1-click Reseed / Reset database button.
- **Demo Persona Switcher:**
  - One-click global switcher in the top navigation between:
    - **Aarav Sharma (Demo Donor - Pune)**
    - **Priya Deshmukh (Demo Seeker - Pune)**
    - **Dev Admin (Community Moderator - Bengaluru)**

---

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling & Design System:** Tailwind CSS, Custom Glassmorphism, Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Playfair Display*)
- **Animations & 3D:** Framer Motion (perspective 3D tilt, glare, springs, transitions), Canvas Confetti
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (BarChart, PieChart, ResponsiveContainer)
- **State & Persistence:** Centralized `storageService` with synchronous/asynchronous repository abstraction, local storage persistence, and initial seed dataset.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch at: **`http://localhost:3000/`**

### 3. Production Build
```bash
npm run build
```

---

## 👥 Demo Personas
| Persona | Name | Role | City | Context |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Donor** | Aarav Sharma | `donor` | Pune (Kothrud) | Has active listings and pending incoming requests |
| **Demo Seeker** | Priya Deshmukh | `seeker` | Pune (Viman Nagar) | Student & seeker who has requested and saved items |
| **Demo Admin** | Dev Admin | `admin` | Bengaluru | Community moderator with access to `/admin` dashboard |

*Use the avatar button in the top navigation bar to toggle between personas instantly.*

---

## 📁 Project Architecture
```
DONATE_CLOTH_ASH_FINAL/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ClothingCard.tsx       # 3D interactive tilt card with fallback
│   │   │   ├── TiltCard.tsx           # Framer motion 3D perspective container
│   │   │   ├── SkeletonCard.tsx       # Loading shimmer skeleton
│   │   │   ├── Navbar.tsx             # Sticky navigation with role indicator
│   │   │   ├── Footer.tsx             # Editorial mission footer
│   │   │   ├── DemoSwitcher.tsx       # Persona selector & reset trigger
│   │   │   └── ToastContainer.tsx     # Animated toast alerts
│   │   └── modals/
│   │       ├── RequestModal.tsx       # Clothing request flow
│   │       ├── ReportModal.tsx        # Content safety report modal
│   │       └── ConfirmModal.tsx       # Accessible action confirmation
│   ├── context/
│   │   └── AppContext.tsx             # Global state provider
│   ├── data/
│   │   └── seedData.ts                # 24+ Indian clothing listings & seed users
│   ├── pages/
│   │   ├── HomePage.tsx               # 3D Hero, trust strip, community picks
│   │   ├── DiscoverPage.tsx           # Multi-faceted search & filters
│   │   ├── ListingDetailPage.tsx      # Image gallery, privacy, donor trust
│   │   ├── GiveClothesPage.tsx        # Multi-step donation wizard
│   │   ├── ActivityPage.tsx           # Requests & handover coordination
│   │   ├── ImpactPage.tsx             # Dynamic circularity calculator
│   │   ├── HowItWorksPage.tsx         # Donor & seeker steppers, FAQ
│   │   ├── GuidelinesPage.tsx         # Cleanliness & dignity rules
│   │   ├── ProfilePage.tsx            # Trust badges & account preferences
│   │   └── AdminPage.tsx              # KPI metrics, Recharts, moderation
│   ├── services/
│   │   └── storageService.ts          # Centralized repository & persistence
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces & types
│   ├── utils/
│   │   └── illustrationFallbacks.tsx  # Dynamic SVG category illustrations
│   ├── App.tsx                        # Router layout
│   ├── index.css                      # Tailwind tokens, glassmorphism, 3D
│   └── main.tsx                       # App entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛡️ Trust & Privacy Guardrails
1. **Zero Public Address Leakage:** Exact street addresses and telephone numbers are withheld from public view. Only the city and general neighborhood are displayed.
2. **Approved Coordination:** Full handover details are disclosed privately in *My Activity* only after a donor formally approves the seeker's request.
3. **Report & Moderation System:** Every listing features a flag modal enabling the community to report damaged, soiled, or commercial postings.

---

Built for **Cloth Forward** — *Reuse, Dignity & Community*.
