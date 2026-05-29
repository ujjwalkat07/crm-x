# CRM-X — Premium Growth & Relationship Management

![CRM-X Banner](image.png)

## Overview

**CRM-X** is a next-generation Customer Relationship Management platform. Engineered as a high-performance monorepo, it combines state-of-the-art Web UI design, client-server decoupling, and advanced automation to streamline sales pipelines, leads tracking, and relationship data integrity.

Designed with **rich aesthetics**, the dashboard features beautiful glassmorphism, adaptive dark mode compliance, and precise micro-interactions for a premium CRM experience.

---

## 💎 Key Features

- ⚡ **Turborepo Monorepo Architecture** – Ultra-fast cached builds, type verification, and workspace organization managed via `pnpm` workspaces.
- 👥 **High-Fidelity Leads Manager** – Advanced data-tables with client-side CSV bulk importing, targeted exports (selected, filtered, or all), pagination, and smart multi-criteria filtering.
- 📞 **Click-to-Call Direct Dialing** – Instant, styled calling options (`tel:` protocols) embedded directly inside phone cells and primary action toolbars, complete with group hover focus states.
- 🎨 **Visual Color Badging** – Dynamic color codes matching priority levels (Rose for High, Amber for Medium, Blue for Low) and customized lead status tags (Blue for Open, Emerald for Active, Slate for Closed, Rose for Lost).
- 🔄 **Auto Database Syncing** – Standalone reactive callback handles (`fetchLeads`) that trigger post-deletion to keep the client application completely synchronized with the server's backend database.
- 🔔 **Modern Notification Popups** – Direct integration with `react-toastify` for toast success alerts and error popups, replacing default browser actions.
- 🛡️ **Custom ConfirmModal Overlay** – Elegant custom glassmorphism modal overlays replacing browser-native confirmations for critical destructive actions.
- 🗂️ **Collapsible Dashboard Sidebar** – A responsive desktop sidebar that dynamically collapses from `w-64` to `w-20` on click, saving its state in `localStorage` to prevent UI shifting during navigation.

---

## 🛠️ Tech Stack

### Client (`apps/crm-client`)
- **Framework**: Next.js 16 (App Router, Client Components)
- **Styling**: Tailwind CSS & custom glassmorphism systems
- **Animations**: Framer Motion (staggered listings, springs, and exit animations)
- **Icons**: Lucide React
- **Notifications**: React-Toastify

### Server (`apps/crm-server`)
- **Runtime**: Node.js
- **Framework**: Express API services
- **Database Utilities**: Custom schema routing

### Packages (`packages/*`)
- **Shared UI**: Custom React element component stubs (`@repo/ui`)
- **Linter & Configurations**: ESLint and TypeScript configs (`@repo/eslint-config`, `@repo/typescript-config`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js >= 18** and **pnpm** installed globally:

```sh
npm install -g pnpm
```

### Installation

1. Clone the repository and navigate into the project root:
   ```sh
   cd crm-x
   ```
2. Install monorepo dependencies:
   ```sh
   pnpm install
   ```

### Command Reference

The platform utilizes **Turborepo** to orchestrate workspace pipeline commands:

| Command | Action |
| :--- | :--- |
| `pnpm run dev` | Spins up the client (`:3000`) and server (`:5000`) development instances concurrently |
| `pnpm run build` | Compiles production bundles for all applications and packages |
| `pnpm run lint` | Runs ESLint checks across the entire codebase |
| `pnpm run check-types` | Executes TypeScript typechecks in every application and package workspace |
| `pnpm run format` | Runs Prettier to format markdown, typescript, and styling code |

---

## 📂 Project Structure

```
crm-x/
├── apps/
│   ├── crm-client/         # Next.js CRM Dashboard Application
│   └── crm-server/         # Express Node Backend API Services
├── packages/
│   ├── ui/                 # Shared React component workspace
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared tsconfig blueprints
├── pnpm-workspace.yaml     # Workspace declaration map
├── turbo.json              # Turborepo task pipeline rules
└── README.md               # Primary project documentation
```
