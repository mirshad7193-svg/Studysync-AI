# 🎓 StudySync AI — Intelligent Academic Workspace & Study Companion

[![Live Demo](https://img.shields.io/badge/Live%20Demo-StudySync%20AI-6366f1?style=for-the-badge&logo=vercel)](https://studysync-ai-nv9p.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini 3.6 Flash](https://img.shields.io/badge/Gemini_3.6_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

🌐 **LIVE DEPLOYED APPLICATION:** [https://studysync-ai-nv9p.vercel.app/](https://studysync-ai-nv9p.vercel.app/)

---

## 🎯 Problem Statement & Target Audience

### The Problem
University and college students face constant cognitive overload:
- Managing multiple overlapping assignment deadlines across various courses.
- Struggling with poor time allocation and inefficient last-minute cramming.
- Spending hours sifting through dense lecture notes without active recall tools.
- Fragmented collaboration tools for group projects.
- Difficulty maintaining deep focus during long study sessions.

### The Solution: StudySync AI
**StudySync AI** is a unified, AI-driven academic workspace designed specifically for college students, high school seniors, and lifelong learners. It transforms unstructured course workloads into structured, optimized study schedules, active recall study packs (flashcards & quizzes), collaborative team boards, and science-backed focus environments.

---

## ✨ Comprehensive Features List

### 📅 1. AI Academic Schedule Optimizer
- **Smart Time-Blocking**: Automatically converts assignment deadlines and exam dates into optimized, manageable study sessions.
- **Energy Peak Alignment**: Customizes session timing based on your peak alertness hours (*Morning, Afternoon, Evening, or Night Owl*).
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

### ⏱️ 5. Pomodoro Focus Room & Ambient Sound Engine
- **Flexible Timers**: Pre-configured standard Pomodoro blocks (25m Focus, 5m Short Break, 15m Long Break).
- **Web Audio Sound Generator**: Real-time synthetic audio generator featuring:
  - 🌧️ **Pink/Brown Noise Rain FX**
  - 📻 **White Noise**
  - 🎧 **Alpha Frequency Binaural Beats (200Hz/210Hz)**
- **Focus Time Tracker**: Logs completed focus minutes straight into your personal productivity dashboard.

### 💬 6. Context-Aware AI Study Advisor
- **Slide-Out Assistant**: Instant drawer access from anywhere in the app.
- **Course-Aware Guidance**: Understands your active deadlines, workload, and course names to give relevant academic advice.
- **Smart Subject Fallbacks**: Responds with subject-specific strategies (Algorithms, Biology, Math, Writing, Time Management) tailored to your exact question.

---

## 🤖 AI Features & System Instructions (Prompts)

The application utilizes **Google Gemini 3.6 Flash** integrated via server-side Express routes to protect API credentials and deliver structured JSON outputs.

### 1. AI Schedule Optimizer Prompt
```text
System Instruction:
"You are a supportive, highly organized AI academic advisor specializing in time management and cognitive retention strategies."

User Prompt:
"You are an expert AI academic schedule planner for college and university students.
Analyze the student's assignments, deadlines, priorities, and study preferences to generate an optimal study schedule.
Peak Energy Hours: [Morning/Afternoon/Evening/Night]
Target Max Study Hours/Day: [Hours]
Current Assignments: [JSON Array of Assignments]
Generate 4-6 realistic, actionable study sessions distributed across upcoming days."
```

### 2. Note Summarizer, Flashcards & Quiz Engine Prompt
```text
System Instruction:
"You are an elite study aid synthesizer that turns raw lecture notes into structured study packs with flashcards and quizzes."

User Prompt:
"Analyze the following lecture notes/study material for the course '[Course Title]':
Title: '[Lecture Title]'
Content: '[Raw Text]'

Return JSON with:
1. Executive Summary (2-3 clear paragraphs)
2. Key Takeaways (3-5 bullet points)
3. Flashcards (3-5 question/answer pairs)
4. Practice Quiz (2-3 multiple choice questions with options, correct index, and explanations)"
```

### 3. AI Task Breakdown Engine Prompt
```text
User Prompt:
"Break down this assignment into 3-5 clear, concrete, sequential subtasks:
Assignment: '[Title]'
Course: '[Course Name]'
Estimated total hours: [Hours]
Notes/Details: '[Details]'"
```

### 4. Context-Aware AI Study Advisor Chat Prompt
```text
System Instruction:
"You are StudyPulse AI, a smart, encouraging academic mentor for college students.
Help students stay organized, explain tricky study topics clearly, suggest task priorities, or offer exam prep tips.
Keep responses clear, well-structured, and helpful. Use bullet points or bold text where appropriate."
```

---

## 🛠️ Tools, Services, and AI Models

- **AI Model**: Google Gemini 3.6 Flash (`gemini-3.6-flash`) via `@google/genai` SDK
- **Frontend Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons, Motion/Framer Motion
- **Backend API**: Node.js, Express.js server (`server.ts`)
- **Sound Synthesis**: Browser-native Web Audio API (Binaural beats, Pink Noise, White Noise)
- **Deployment & Hosting**: Live on Vercel (`https://studysync-ai-nv9p.vercel.app/`)
- **Version Control**: GitHub Public Repository

---

## 📸 App in Action (Screenshots)

### 1. Study Schedule & Planner View
> *Interactive weekly study calendar with AI schedule optimizer, day selectors, and session block management.*

```
+-----------------------------------------------------------------------+
|  Study Schedule & Planner                                             |
|  [ AI Schedule Optimizer ]  [ + Add Block ]                            |
|  [ MON 27 ]  [ TUE 28 ]  [ WED 29 ]  [ THU 30 ]                       |
|  -------------------------------------------------------------------  |
|  Schedule for Monday, Jul 27                                          |
|  [x] 09:00 - 11:00  [Assignment] Algorithms Graph Lab Coding Session  |
+-----------------------------------------------------------------------+
```

### 2. AI Study Companion Chat Drawer
> *Slide-out AI Advisor providing real-time, course-aware guidance for graph lab coding, algorithms, and study strategies.*

```
+-----------------------------------------------------------------------+
| 🤖 AI Study Companion (Gemini 3.6 Flash)                            |
| 💬 "For your Graph Lab & Computer Science query:                      |
|    1. Key Concepts: Adjacency Lists vs Matrices, Dijkstra's Algorithm |
|    2. Recommended 2-Hour Plan: Trace graph -> Code logic -> Test"     |
+-----------------------------------------------------------------------+
```

### 3. AI Note Summarizer, Flashcard & Quiz Room
> *Transforms lecture transcripts into interactive 3D flashcards and multiple-choice quizzes with instant feedback.*

```
+-----------------------------------------------------------------------+
| 📚 Note Summarizer                                                    |
| [ Summary ]  [ Flashcards (1/3) ]  [ Practice Quiz ]                   |
| +-------------------------------------------------------------------+ |
| | Q: What is the primary objective of Cellular Respiration?         | |
| | (Click to flip card)                                              | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/studysync-ai.git
   cd studysync-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 📄 Submission Summary

- **Public Live URL**: [https://studysync-ai-nv9p.vercel.app/](https://studysync-ai-nv9p.vercel.app/)
- **Original Concept**: All-in-one AI Academic Workspace & Study Companion for students.
- **Completeness**: 100% functional end-to-end (Schedule planner, Task breakdown, Note summarizer, Flashcards, Quizzes, Group workspaces, Focus room audio generator, and AI Chat).
- **AI Integration**: Server-side Gemini 3.6 Flash integration with custom system instructions and intelligent query-aware fallbacks.

---
Made with ❤️ for students worldwide. Powered by **Google Gemini 3.6 Flash**.

