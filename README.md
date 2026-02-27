<div align="center">
  <br />
  
  <br />
  <h1><strong>MediCloud</strong></h1>
  <p>
    <strong>Seamless Healthcare Management, Smart AI Consultations & Geolocation Intelligence.</strong>
  </p>

  <p>
    <a href="https://medicloudhost-coral.vercel.app/"><img src="https://img.shields.io/badge/Live_Project-medicloudhost--coral.vercel.app-14b8a6?style=for-the-badge&logo=vercel" alt="Live Release" /></a>
    <img src="https://img.shields.io/github/license/Ansh280705/Medicloudhost?style=for-the-badge&color=8b5cf6" alt="License" />
    <img src="https://img.shields.io/github/stars/Ansh280705/Medicloudhost?style=for-the-badge&color=eab308" alt="Stars" />
    <br />
    <img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-3b82f6?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Groq-AI_Inference-f97316?style=for-the-badge&logo=groq" alt="Groq" />
  </p>
</div>

<br />

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#demo">Live Demo</a> •
  <a href="#core-features">Features</a> •
  <a href="#installation">Setup</a> •
  <a href="#roadmap">Roadmap</a>
</div>

<br />

<br />

## 🌟 Overview

The modern healthcare experience is disjointed. Patients struggle to discover real-time clinic availabilities, physical distances are opaque, and getting immediate medical advice is often impossible. 

**MediCloud** bridges this gap. It provides a highly unified platform that integrates physical geolocation-based clinic discovery with ultra-low latency voice-enabled AI consultations, wrapped in a robust booking and payment pipeline engineered for massive scale.

---

## 🛠 Problem & Solution Architecture

### The Broken Legacy Model
```mermaid
graph LR
    A[Patient] -->|Waiting hours| B(Physical Reception)
    A -->|Google Search| C(Inaccurate Clinic Data)
    A -->|Emergency| D(No Immediate Advice)
    
    style A fill:#f87171,stroke:#b91c1c,color:#fff
    style B fill:#fca5a5,stroke:#b91c1c,color:#fff
    style C fill:#fca5a5,stroke:#b91c1c,color:#fff
    style D fill:#fca5a5,stroke:#b91c1c,color:#fff
```

### The MediCloud Pipeline
```mermaid
graph LR
    A([Patient]) --> |Web/Mobile| API{Next.js Edge API}
    
    API -->|Auth| CL[Clerk Security Layer]
    API -->|Realtime Geo| geo[OpenStreetMap + Haversine]
    API -->|Voice Consult| AI[Groq LPU Inference]
    API -->|Payments| PG[Razorpay / PhonePe]
    
    geo --> DB[(Neon PostgreSQL)]
    AI --> DB
    PG --> DB
    
    style A fill:#14b8a6,stroke:#0f766e,color:#fff
    style API fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style DB fill:#3b82f6,stroke:#1d4ed8,color:#fff
    style AI fill:#f97316,stroke:#c2410c,color:#fff
```

---

## 🏗 System Architecture

MediCloud operates on a fully distributed serverless architecture leveraging Edge networks for latency-sensitive AI routing and geo-spatial calculations.

### Container (C4) Level Diagram
```mermaid
C4Context
    title System Context diagram for MediCloud System
    Person(patient, "Patient", "A user seeking medical help or clinics.")
    Person(doctor, "Doctor", "A medical professional taking appointments.")
    Person(admin, "Admin", "Manages platform clinics & payouts.")
    
    System(app, "MediCloud Core", "Allows patients to book, consult AI, and find clinics.")
    
    System_Ext(clerk, "Clerk Auth", "Identity Management")
    System_Ext(groq, "Groq AI Cloud", "Sub-second LLM inference")
    System_Ext(osm, "OpenStreetMap", "Geocoding API")
    System_Ext(razorpay, "Payment Gateways", "Razorpay / PhonePe")

    Rel(patient, app, "Uses", "HTTPS")
    Rel(doctor, app, "Uses", "HTTPS")
    Rel(admin, app, "Uses", "HTTPS")

    Rel(app, clerk, "Authenticates via")
    Rel(app, groq, "Streams Voice/Text AI tokens via")
    Rel(app, osm, "Translates address to Lat/Lng via")
    Rel(app, razorpay, "Initiates payments via")
```

### Database Schema (Entity-Relationship)
```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : books
    USER ||--o{ EMERGENCY_ALERT : triggers
    USER ||--o{ CREDIT_TRANSACTION : makes
    USER ||--o{ PAYOUT : receives
    APPOINTMENT ||--o| PRESCRIPTION : generates
    CATEGORY ||--o{ BLOG : categorizes

    USER {
        String id PK
        String role "PATIENT, DOCTOR, ADMIN"
        String[] emergencyEmails
        Int credits
    }
    OFFLINE_CLINIC {
        String id PK
        String name
        Float latitude
        Float longitude
        Boolean isActive
    }
    APPOINTMENT {
        String id PK
        DateTime startTime
        String status
    }
```

---

## ⚡ Core Features

| Feature | Technical Implementation | Description |
| :--- | :--- | :--- |
| **🎙 Voice AI Doctor** | `Web Speech API` + `Groq API` | Sub-second latency medical conversational agent supporting English & Hindi streams dynamically via Edge functions. |
| **📍 Geo-Clinic Finder** | `Haversine Formula` + `Nominatim` | Client-side Haversine distance calculations paired with robust multi-layer fallback geocoding for offline Indian clinics. |
| **💳 Fintech Engine** | `Razorpay` / `PhonePe SDK` | Multi-gateway payment router converting fiat into internal platform `Credits` for micro-transactions. |
| **🚨 Emergency SOS** | `Navigator.geolocation` | One-click localized emergency alerting mechanism piping precise coordinates instantly to pre-registered family contacts. |
| **🔒 Identity & RBAC** | `Clerk` | Complete Role-Based Access Control mapping `Admins`, `Doctors`, and `Patients` to strictly partitioned serverless actions. |

---


---

## 🧬 Deployment Architecture & Security

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Frontend (Edge)
    participant ServerActions as Backend Actions
    participant Groq as Groq AI API
    participant Neon as PostgreSQL (Neon)

    User->>NextJS: Requests /api/ai/doctor-chat (Audio Input)
    activate NextJS
    NextJS->>ServerActions: Validates Clerk Session Token
    ServerActions-->>NextJS: Token Valid
    NextJS->>Groq: Stream Inference Request (Context Injected)
    activate Groq
    Groq-->>NextJS: Event-Stream Chunks
    deactivate Groq
    NextJS-->>User: Synthesizes Speech Output
    deactivate NextJS
    
    User->>ServerActions: Requests Clinic Proximity
    ServerActions->>Neon: Prisma findMany(Active Clinics)
    Neon-->>ServerActions: Raw Coordinates
    ServerActions-->>User: Client processes Haversine sorting
```

### Security Measures
- **Database Connection Pooling:** PgBouncer via Neon DB to prevent TCP connection exhaustion on serverless boot-ups.
- **Payload Encryption:** All biometric and health data points transit exclusively over TLS 1.3.
- **Geocoding Anonymity:** Browser GPS triggers coordinate dumps exclusively locally; no tracking payload is persisted to DB on patient discovery loads.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js `v18.17+` (v20+ recommended)
- Git
- API Keys for Clerk, Groq, Razorpay, Neon PostgreSQL.

### 1. Clone & Install
```bash
git clone https://github.com/Ansh280705/Medicloudhost.git
cd Medicloudhost
npm install
```

### 2. Environment Configuration
Create a `.env` file at the root. Use the exact formats below:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PG connection string | `postgresql://user:pass@ep-x.neon.tech/neondb` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Frontend Auth Key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Backend Auth Key | `sk_test_...` |
| `GROQ_API_KEY` | AI Inference LLM token | `gsk_...` |
| `NEXT_PUBLIC_VONAGE_APPLICATION_ID` | Vonage App ID (Video/Comms) | `5638541a-3307...` |
| `VONAGE_PRIVATE_KEY` | Vonage Backend Auth Key | `-----BEGIN PRI...` |
| `PHONEPE_MERCHANT_ID` | PhonePe Payment PG | `M237W6QSZFRUE` |
| `PHONEPE_CLIENT_ID` | PhonePe App Config ID | `SU260212...` |
| `PHONEPE_CLIENT_SECRET` | PhonePe Auth Secret | `d3b...` |
| `NEXT_PUBLIC_REDIRECT_URL` | Payment Webhook Routing | `https://your-live-domain...` |

### 3. Database Hydration
```bash
npx prisma generate
npx prisma db push
```

### 4. Boot Development Server
```bash
npm run dev
# Server boots at http://localhost:3000
```

---

## � Codebase Anatomy

```bash
📦 Medicloudhost
 ┣ 📂 actions          # Next.js Server Actions (Backend mutations logic)
 ┣ 📂 app
 ┃ ┣ 📂 (main)         # Protected layout (Dashboard, Clinics, AI Consult)
 ┃ ┣ 📂 api            # Edge/Server API Routes (Groq Streaming)
 ┃ ┗ 📜 layout.js      # Root Document & Provider Injections
 ┣ 📂 components       # Shadcn + Custom UI elements
 ┣ 📂 hooks            # Web Speech API hooks (useSpeechSynthesis, etc.)
 ┣ 📂 lib              # Prisma instance, Utilities, Formatter
 ┣ 📂 prisma           # schema.prisma models
 ┗ 📜 middleware.js    # Edge-based Auth routing interceptor
```

---

## 🗺 Roadmap (2026)

```mermaid
gantt
    title MediCloud Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: MVP Platform
    Core Auth & DB Setup       :done,    des1, 2026-02-01,2026-02-10
    Doctor & Patient Roles     :done,    des2, 2026-02-10,2026-02-15
    section Phase 2: ML & Geo
    Groq Voice AI Integration  :done,    des3, 2026-02-16,2026-02-23
    Offline Clinic Locator     :done,    des4, 2026-02-24,2026-02-27
    section Phase 3: Scale
    WebRTC Video Sessions      :active,  des5, 2026-03-01,2026-03-15
    IoT Health Data Ingestion  :         des6, 2026-03-20,2026-04-10
```

---

## 🤝 Contributing
As an open-source health-tech initiative, we welcome high-quality PRs. 

1. **Fork** the repository.
2. **Branch** off `main` (`git checkout -b feature/amazing-feature`).
3. **Commit** changes cleanly (`git commit -m 'feat: Add amazing feature'`).
4. **Push** to your fork.
5. Open a **Pull Request**.

---

<div align="center">
  
</div>
