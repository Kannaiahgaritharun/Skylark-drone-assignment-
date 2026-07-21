# Skylark Drones BI Platform & AI Copilot
**LIVE DEMO:**https://skylark-drones-bi-app.vercel.app/

An enterprise-grade Business Intelligence (BI) SaaS application built to provide real-time operational insights, integrating live data from Monday.com with an interactive Google Gemini-powered AI Copilot.

## 🌟 Key Features

*   **Live Monday.com Integration**: Directly fetches and syncs live data across Deals, Work Orders, and Risks pipelines using the Monday.com GraphQL API.
*   **Enterprise UI Redesign**: A meticulously crafted interface heavily inspired by premium SaaS products (Vercel, Stripe, Microsoft Fabric), featuring glassmorphism, fluid animations (Framer Motion), and a robust TailwindCSS v4 design system.
*   **AI Business Analyst Copilot**: An intelligent, context-aware chatbot powered by Google Gemini. The copilot slide-out drawer offers a true "ChatGPT Enterprise" experience with animated typing skeletons, executive Markdown rendering, and strict JSON-structured data responses for rendering metric cards.
*   **Robust AI Failover**: Enterprise-grade backend architecture that seamlessly rotates between Gemini models (`gemini-2.5-flash`, `gemini-2.5-pro`, etc.) with exponential backoff to handle rate limits and transient errors.

## 🏗️ Architecture Stack

### Frontend
*   **Framework**: React 19 + Vite
*   **Styling**: Tailwind CSS v4
*   **Animation**: Framer Motion
*   **Routing**: React Router DOM
*   **Data Visualization**: Recharts
*   **Icons**: Lucide React

### Backend
*   **Framework**: Python FastAPI
*   **AI Engine**: Google GenAI SDK (Gemini)
*   **Data Source**: Monday.com API v2 (GraphQL)
*   **CORS & Middleware**: Configured for seamless local SPA development

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   Monday.com API Key
*   Google Gemini API Key (Google AI Studio)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   MONDAY_API_KEY=your_monday_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   # Runs on http://localhost:8000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```

## 🎨 Design System
The frontend implements a rigorous enterprise design system:
*   **Spacing**: 8px modular scale for consistent rhythm.
*   **Radii**: Standardized to 16px/24px for major container elements and 12px for interior elements.
*   **Shadows**: Multi-layered, ultra-soft box shadows (`shadow-premium`) to establish visual hierarchy without heavy borders.
*   **Typography**: Relies on the `Inter` font family for maximum legibility in data-dense tables and executive summaries.

## 📝 License
This project is part of an assignment and is provided as-is.
