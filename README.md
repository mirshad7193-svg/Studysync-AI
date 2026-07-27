# 🎓 StudySync AI — Intelligent Academic Workspace & Study Companion

[![Live Demo](https://img.shields.io/badge/Live%20Demo-StudySync%20AI-6366f1?style=for-the-badge&logo=vercel)](https://studysync-ai-nv9p.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini 3.6 Flash](https://img.shields.io/badge/Gemini_3.6_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**StudySync AI** is an all-in-one, AI-powered academic workspace designed for university students, high schoolers, and lifelong learners. It combines intelligent schedule optimization, automated note summarization, interactive flashcards, collaborative group workspaces, and a science-backed focus room into a single fluid interface.

🌐 **Live Application:** [https://studysync-ai-nv9p.vercel.app/](https://studysync-ai-nv9p.vercel.app/)

---

## ✨ Key Features

### 📅 1. AI Academic Schedule Optimizer
- **Smart Time-Blocking**: Automatically converts assignment deadlines and exam dates into optimized, manageable study sessions.
- **Energy Peak Alignment**: Customizes session timing based on your peak alertness hours (Morning, Afternoon, Evening, or Night Owl).
- **One-Click Calendar Sync**: Import AI-recommended study blocks directly into your active weekly planner.

### 📝 2. AI Task Breakdown Engine
- **Subtask Generation**: Transforms overwhelming course projects into digestible, 3–5 step sequential milestones.
- **Priority & Status Tracking**: Assign priorities (*High, Medium, Low*) and track status (*To Do, In Progress, Completed*).
- **Time Estimation**: Displays estimated completion hours to prevent burnout and last-minute cramming.

### 📚 3. AI Note Summarizer, Flashcards & Quizzes
- **Instant Study Packs**: Paste raw lecture transcripts or class notes to generate structured study materials in seconds.
- **Executive Summaries**: Get concise overviews along with bulleted high-yield takeaways.
- **Interactive Flashcards**: Test memory with 3D flip cards, progress navigation, and a *Mark Mastered* tracker.
- **Self-Assessment Quizzes**: Multiple-choice quizzes complete with immediate answer checking and explanations.

### 👥 4. Collaborative Group Workspaces
- **Shared Kanban Task Boards**: Assign specific project responsibilities to team members across *To Do*, *In Progress*, and *Completed* columns.
- **Collaborative Document Editor**: Edit shared project charters, meeting notes, and outlines in real time.
- **Team Discussion Chat**: Embedded group chat room for instant communication and project coordination.

### ⏱️ 5. Pomodoro Focus Room & Sound Generator
- **Flexible Timers**: Pre-configured standard Pomodoro blocks (25m Focus, 5m Short Break, 15m Long Break).
- **Web Audio Sound Generator**: Real-time synthetic audio generator featuring:
  - 🌧️ **Pink/Brown Noise Rain FX**
  - 📻 **White Noise**
  - 🎧 **Alpha Frequency Binaural Beats (200Hz/210Hz)**
- **Focus Time Tracker**: Logs completed focus minutes straight into your personal productivity dashboard.

### 💬 6. Context-Aware AI Study Advisor
- **Slide-Out Assistant**: Instant drawer access from anywhere in the app.
- **Course-Aware Guidance**: Understands your active deadlines, workload, and course names to give relevant academic advice.
- **Quick Prompts**: Pre-loaded prompts for study strategies, concept explanations, and time management tips.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Backend API** | Node.js, Express.js |
| **AI SDK** | Google Gen AI SDK (`@google/genai`) |
| **AI Model** | Gemini 3.6 Flash |
| **Audio Synthesis** | Web Audio API (Browser Native) |
| **Deployment** | Vercel / Cloud Run |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (optional for live AI calls; includes automatic fallback modes if unconfigured)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/studysync-ai.git
   cd studysync-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 📂 Project Structure

```
.
├── server.ts                   # Express server entry point & Gemini API endpoints
├── src/
│   ├── App.tsx                 # Main Application Layout & State Container
│   ├── main.tsx                # React DOM Client Entry
│   ├── types.ts                # TypeScript interfaces for Assignments, Notes, Projects, Sessions
│   ├── mockData.ts             # Initial demo data seed
│   ├── components/
│   │   ├── Navbar.tsx          # Main header & navigation bar
│   │   ├── DashboardView.tsx   # Dashboard widgets & metrics overview
│   │   ├── AssignmentsView.tsx # Task management & AI subtask breakdown
│   │   ├── StudyPlannerView.tsx# Weekly schedule planner & AI schedule optimizer
│   │   ├── GroupProjectsView.tsx# Team workspaces, shared docs & chat
│   │   ├── NoteSummarizerView.tsx# AI note processing, flashcards & quizzes
│   │   ├── FocusTimerModal.tsx # Pomodoro timer & ambient sound engine
│   │   └── AIAssistantDrawer.tsx# AI Study Companion chat drawer
├── package.json
└── README.md
```

---

## 🌟 Key Application Screens

1. **Dashboard**: High-level overview of pending deadlines, study progress, active group projects, and quick-action tools.
2. **Assignments & Tasks**: Task list filtered by course, status, or priority, featuring AI-driven step breakdown.
3. **Study Planner**: Weekly timeline with morning/afternoon/evening slots and automated AI session suggestions.
4. **Group Projects**: Multi-project collaborative workspace with team roster management.
5. **AI Note Summarizer**: Input interface for raw lecture notes with instant generation of summaries, flashcards, and quizzes.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p center>
  Made with ❤️ for students worldwide. Powered by <b>Google Gemini 3.6 Flash</b>.
</p>
