Dzinr 🎨
------------
Transform ideas into interfaces — instantly.

Dzinr is a full-stack app that leverages AI to transform user prompts into mobile UI designs, bridging the gap between idea and interface.

🚀 Features
-----------------------------------------------------------------------------------------------------------------------
- 🧠 Natural Language to UI — Interprets plain text prompts to generate mobile UI wireframes 
-📱 Multi-Screen Layouts — Generates structured, multi-screen designs with logical organization and visual hierarchy
- ⚙️ Agentic Workflow Orchestration — Automates task pipelines for seamless end-to-end generation
- ✏️ Smart Title Generation — Automatically generates app titles using Gemini Flash Lite
- 💾 Persistent Storage — MongoDB integration for saving and retrieving generated designs
- 🌐 Interactive Visualization — Web-based interface to explore and interact with generated wireframes

🛠️ Tech Stack
----------------------------------------------------------------------------------------------------------------------
-Frontend: Next.js 16, Tailwind CSS, Redux Toolkit
-Backend: Inngest
-AI Integration: OpenRouter API, Gemini Flash 2.5 Lite
-Authentication: Kinde Auth
-Database: MongoDB
-Deployment: Vercel
-Version Control: Git & GitHub

📦 Getting Started
Prerequisites

Node.js 18+
MongoDB instance
API keys for OpenRouter and Gemini Flash 2.5 Lite
Kinde Auth account

Installation
bash# Clone the repository
git clone https://github.com/your-username/dzinr.git
cd dzinr

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys and credentials

# Run the development server
npm run dev
Open http://localhost:3000 to view the app.

🔑 Environment Variables
Create a .env.local file in the root directory with the following:
env# AI
OPENROUTER_API_KEY=your_openrouter_key
GEMINI_API_KEY=your_gemini_key

# Auth (Kinde)
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=your_kinde_issuer_url
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Database
MONGODB_URI=your_mongodb_connection_string

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

🧭 How It Works
------------------------
Input — User enters a natural language description of their app idea
Processing — Inngest orchestrates the agentic workflow, triggering AI generation tasks
Generation — OpenRouter API + Gemini Flash Lite generate the app title and wireframe layouts
Preview — Generated wireframes are rendered in real-time via the Wireframe Renderer
Storage — Results are saved to MongoDB for future access

