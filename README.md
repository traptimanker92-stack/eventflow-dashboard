# EventFlow — Event Management & Analytics Dashboard

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide](https://img.shields.io/badge/Icons-Lucide_React-F43F5E)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**EventFlow** is a modern, responsive, portfolio-grade Event Management & Registration Analytics Dashboard built with **React, Vite, Tailwind CSS, Lucide Icons, and LocalStorage persistence**.

Designed with a sleek SaaS dark aesthetic, EventFlow offers a comprehensive end-to-end event lifecycle management workflow — including real-time registration tracking, interactive capacity utilization, attendee roster management with CSV export, rich data analytics, and responsive desktop-to-mobile interfaces.

---

## ✨ Key Features

### 1. 📊 Executive Dashboard
- **Real-Time KPIs**: Total Events, Upcoming Schedules, Ongoing Live Summits, Total Registrations, and Aggregate Capacity Utilization.
- **Urgent Summit Spotlight**: Live highlight of the closest upcoming event with schedule, venue, speaker, and live seat allotment progress.
- **Recent Registrations Stream**: Quick view of latest attendee registrations.
- **Direct Navigation**: Fast access to event creation, attendee lists, and analytical reports.

### 2. 🗓️ Comprehensive Event Lifecycle Management
- **Full CRUD Operations**: Create new tech conferences, edit event schedules and venues, inspect deep-dive rosters, and delete events with confirmation safety.
- **Event Parameters**:
  - Event title, category, date, time slot, and venue location.
  - Primary speaker & keynote role.
  - Total seating capacity & live registered count.
  - Lifecycle statuses: `Upcoming`, `Ongoing`, `Completed`.
  - Detailed description & agenda topics.
- **Event Modal**: Polished modal with input validation (capacity rules, date/time checks, text fields).

### 3. 💳 Interactive Event Cards & Views
- **Dual View Modes**: Switch seamlessly between **Grid Cards** and **Dense Table View**.
- **Dynamic Capacity Progress Bar**: Color-coded thresholds (`Emerald` $\to$ `Indigo` $\to$ `Amber` $\to$ `Rose`) showing fill percentage and remaining slots.
- **Contextual Actions**: View Agenda & Attendees, Quick Register, Edit, and Delete.

### 4. 👥 Attendee & Registration Database
- **Participant Directory**: View attendee names with avatars, emails, contact numbers, organization/company, and ticket tiers (`General Access`, `VIP Attendee`, `Hacker Pass`, `Student Pass`).
- **Live Check-In Status**: Toggle participant check-in states between `Confirmed`, `Checked-In`, and `Attended`.
- **Search & Filter**: Search participants by name, email, or organization; filter by specific event and check-in status.
- **CSV Data Export**: Export filtered participant rosters directly to `.csv` format.
- **Client-Side Pagination**: Clean pagination controls with customizable rows per page.

### 5. 📈 Interactive Analytics & Charts (Recharts)
- **Registration Growth Velocity**: Area chart visualizing cumulative attendee momentum.
- **Capacity vs Registered by Event**: Multi-bar comparative chart depicting seating load across summits.
- **Lifecycle Breakdown**: Donut chart tracking events by status (`Upcoming`, `Ongoing`, `Completed`).
- **Category Distribution**: Horizontal bar chart showing coverage across tech subjects (Engineering, AI/ML, Cloud, Security, Design, Mobile).
- **Executive Metrics**: Sold-out summits count, average registrations per event, and overall utilization rate.

### 6. ⚙️ System Settings & Data Resilience
- **LocalStorage Persistence**: Zero-latency client-side database; all changes persist across reloads.
- **Backup & Migration**:
  - **Export JSON Backup**: Full snapshot of events, registrations, and configurations.
  - **Import JSON Backup**: Restore or migrate database state from JSON files.
  - **Reset Demo Data**: Restore sample technology summits and attendee rosters with 1-click.
- **Micro-Interactions**: Particle animations (confetti) on successful registrations/creations.

### 7. 📱 Mobile & Tablet Responsive Architecture
- **Desktop**: Collapsible sidebar, multi-column card grids, and interactive data tables.
- **Mobile / Tablet**: Off-canvas slide-out navigation drawer, horizontal-scroll-free responsive tables, touch-friendly action targets, and adaptive modals.

---

## 🛠️ Tech Stack & Frontend Concepts

| Layer | Technology |
|---|---|
| **Core Framework** | React 18 (Functional Components, Hooks) |
| **Build Tooling** | Vite (Fast HMR & Optimized Bundles) |
| **Styling** | Tailwind CSS (Dark theme, Glassmorphism, Custom Gradients) |
| **Icons** | Lucide React |
| **Data Visualization** | Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart) |
| **State Management** | React Context API (`EventContext`) + Custom Hooks |
| **Data Persistence** | Browser `localStorage` with JSON serialization & error recovery |
| **Micro-Interactions** | Canvas Confetti & Tailwind keyframe transitions |

### Key Frontend Concepts Demonstrated:
- **Modular Component Architecture**: Decoupled, reusable components (`StatCard`, `ProgressBar`, `EventCard`, `RegistrationTable`, `SearchFilter`, `Toast`, `ConfirmModal`).
- **Unidirectional Data Flow & State Lifting**: Centralized store coordinating real-time updates across multiple pages.
- **Form Handling & Validation**: Controlled inputs with error messages and bounds checking (e.g. registered $\le$ capacity).
- **Array Transformations**: Heavy use of `map`, `filter`, `reduce`, and `sort` for real-time calculations and chart feeds.
- **Data Serialization & File I/O**: Creating in-memory Blob links for CSV and JSON download/upload without backend dependencies.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or yarn

### Installation

1. Clone or copy the repository:
```bash
git clone https://github.com/your-username/eventflow-dashboard.git
cd eventflow-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. Deploy!

---

## 🔮 Future Enhancements
- [ ] Multi-language localization (i18n).
- [ ] QR Code generation for attendee check-in badges.
- [ ] Drag-and-drop Kanban view for event planning stages.
- [ ] Integration with Web Calendar API (.ics export).

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
