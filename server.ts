import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  const PORT = 3000;

  // Initialize Gemini AI SDK
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasKey: !!apiKey });
  });

  // Endpoint 1: Suggest Study Schedule
  app.post('/api/ai/suggest-schedule', async (req, res) => {
    const { assignments = [], preferences = {} } = req.body;

    if (ai) {
      try {
        const prompt = `
You are an expert AI academic schedule planner for college and university students.
Analyze the student's assignments, deadlines, priorities, and study preferences to generate an optimal study schedule.

Student Preferences:
- Peak Alertness Period: ${preferences?.peakHours || 'Evening (6 PM - 10 PM)'}
- Preferred Study Block Duration: ${preferences?.sessionDuration || '2 hours'}
- Target Max Study Hours/Day: ${preferences?.maxHoursPerDay || '4 hours'}

Current Assignments:
${JSON.stringify(assignments, null, 2)}

Generate 4-6 realistic, actionable study sessions distributed across the upcoming days (starting from today offset 0).
Align session intensity with assignment priorities and due dates. Ensure break buffer periods.
Provide a motivational, strategy-focused advice paragraph explaining why this schedule was chosen.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a supportive, highly organized AI academic advisor specializing in time management and cognitive retention strategies.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                advice: {
                  type: Type.STRING,
                  description: 'Personalized advice and strategic rationale for the schedule.',
                },
                suggestedSessions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      course: { type: Type.STRING },
                      dateOffsetDays: {
                        type: Type.INTEGER,
                        description: 'Number of days from today (0 for today, 1 for tomorrow, etc.)',
                      },
                      startTime: { type: Type.STRING, description: 'Format HH:mm (e.g. 14:00)' },
                      endTime: { type: Type.STRING, description: 'Format HH:mm (e.g. 16:00)' },
                      type: {
                        type: Type.STRING,
                        description: 'One of: review, exam_prep, group, deep_work, assignment',
                      },
                      reasoning: { type: Type.STRING, description: 'Brief tip on what to focus on during this session' },
                    },
                    required: ['title', 'course', 'dateOffsetDays', 'startTime', 'endTime', 'type'],
                  },
                },
              },
              required: ['advice', 'suggestedSessions'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (error: any) {
        console.error('Schedule AI Error, switching to intelligent fallback:', error.message || error);
      }
    }

    // Fallback Schedule Generator
    const fallbackSessions = (assignments.length > 0 ? assignments : [
      { title: 'Algorithms Graph Lab Coding', course: 'CS 301 - Computer Science' },
      { title: 'Cellular Respiration Research Paper', course: 'BIO 210 - Molecular Biology' },
      { title: 'Linear Algebra Midterm Prep', course: 'MATH 240 - Applied Linear Algebra' },
    ]).map((asg: any, index: number) => ({
      title: `Focus Session: ${asg.title || 'Course Review'}`,
      course: asg.course || 'General Study',
      dateOffsetDays: index % 3,
      startTime: index % 2 === 0 ? '10:00' : '15:00',
      endTime: index % 2 === 0 ? '12:00' : '17:00',
      type: (['deep_work', 'exam_prep', 'assignment', 'review'] as const)[index % 4],
      reasoning: `Targeted session during your ${preferences?.peakHours || 'peak focus'} window to maximize concept retention and progress.`,
    }));

    return res.json({
      advice: `Based on your upcoming workload and peak alertness preference (${preferences?.peakHours || 'Evening'}), I have mapped out high-impact study sessions. We recommend starting with high-priority topics first and utilizing 5-minute Pomodoro breaks.`,
      suggestedSessions: fallbackSessions,
    });
  });

  // Endpoint 2: Note Summarizer, Flashcards & Quiz Generator
  app.post('/api/ai/summarize-notes', async (req, res) => {
    const { rawContent = '', title = 'Lecture Notes', course = 'General Study' } = req.body;

    if (!rawContent || rawContent.trim().length === 0) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    if (ai) {
      try {
        const prompt = `
Analyze the following lecture notes/study material for the course "${course}":
Title: "${title}"

Content:
"""
${rawContent}
"""

Tasks:
1. Executive Summary: Concise overview of core concepts (2-3 sentences).
2. Key Takeaways: 3-5 high-yield bullet points.
3. Interactive Flashcards: 3-5 flashcards with clear questions and concise answers.
4. Practice Quiz: 2-3 multiple-choice practice questions with 4 options each, indicating the correct 0-based index and brief explanation.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite study aid synthesizer that turns raw lecture notes into structured study packs with flashcards and quizzes.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                flashcards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                    required: ['question', 'answer'],
                  },
                },
                quizQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswerIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
                  },
                },
              },
              required: ['summary', 'keyTakeaways', 'flashcards', 'quizQuestions'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (error: any) {
        console.error('Note Summarizer AI Error, switching to intelligent fallback:', error.message || error);
      }
    }

    // Fallback Note Summarizer
    const snippet = rawContent.slice(0, 150).trim();
    return res.json({
      summary: `This lecture note covers key concepts in ${title} (${course}). Primary themes include core foundational principles, analytical methodologies, and practical applications outlined in "${snippet}...".`,
      keyTakeaways: [
        `Core Principle: Understand the fundamental definitions and variables in ${title}.`,
        `Methodology: Apply step-by-step analytical reasoning to solve related problems.`,
        `Key Relationship: Recognize how theoretical concepts connect directly to practical course applications.`,
        `Exam Focus: Review definitions, formulas, and edge cases prior to exams.`,
      ],
      flashcards: [
        {
          question: `What is the primary objective of ${title}?`,
          answer: `To establish a structured understanding of core principles in ${course} and apply them systematically.`,
        },
        {
          question: `Which key mechanism is central to the notes provided?`,
          answer: `The interplay between theoretical models and analytical step-by-step updates.`,
        },
        {
          question: `How should you review this topic for maximum exam retention?`,
          answer: `Focus on active recall, spaced repetition flashcards, and testing yourself on practice problems.`,
        },
      ],
      quizQuestions: [
        {
          question: `What is the most critical first step when analyzing topics in ${title}?`,
          options: [
            `Identify the fundamental variables and core constraints`,
            `Skip straight to complex calculations without reading definitions`,
            `Memorize answers without understanding the underlying steps`,
            `Ignore the lecture notes entirely`,
          ],
          correctAnswerIndex: 0,
          explanation: `Identifying variables and constraints is essential before applying formulas or solving problems.`,
        },
        {
          question: `How does active flashcard testing improve learning?`,
          options: [
            `It relies on passive rereading`,
            `It strengthens memory retrieval pathways through active recall`,
            `It slows down study pace without benefits`,
            `It is only useful for vocabulary terms`,
          ],
          correctAnswerIndex: 1,
          explanation: `Active recall forces the brain to retrieve information, building stronger neural connections.`,
        },
      ],
    });
  });

  // Endpoint 3: Break assignment into actionable subtasks
  app.post('/api/ai/breakdown-task', async (req, res) => {
    const { title = 'Assignment', course = 'General Course', notes = '', estimatedHours = 3 } = req.body;

    if (ai) {
      try {
        const prompt = `
Break down this assignment into 3-5 clear, concrete, sequential subtasks:
Assignment: "${title}"
Course: "${course}"
Estimated total hours: ${estimatedHours} hours
Notes/Details: "${notes}"
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subtasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                    },
                    required: ['title'],
                  },
                },
              },
              required: ['subtasks'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (error: any) {
        console.error('Task Breakdown Error, switching to intelligent fallback:', error.message || error);
      }
    }

    // Fallback Subtask Breakdown
    return res.json({
      subtasks: [
        { title: `Gather requirements & review guidelines for ${title}` },
        { title: `Outline core sections and prepare study resources` },
        { title: `Draft main implementation / writeup for ${course}` },
        { title: `Review, test edge cases, and submit final draft` },
      ],
    });
  });

  // Endpoint 4: AI Study Assistant Chat
  app.post('/api/ai/chat', async (req, res) => {
    const { message = '', context = null, history = [] } = req.body;

    if (ai) {
      try {
        let systemInstruction = `You are StudyPulse AI, a smart, encouraging academic mentor for college students.
Help students stay organized, explain tricky study topics clearly, suggest task priorities, or offer exam prep tips.
Keep responses clear, well-structured, and helpful. Use bullet points or bold text where appropriate.`;

        if (context) {
          systemInstruction += `\n\nCurrent Student Context:\n${JSON.stringify(context)}`;
        }

        const promptParts = [];
        if (history && Array.isArray(history)) {
          for (const msg of history.slice(-6)) {
            promptParts.push(`${msg.sender === 'user' ? 'Student' : 'AI Advisor'}: ${msg.text}`);
          }
        }
        promptParts.push(`Student: ${message}`);

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptParts.join('\n\n'),
          config: {
            systemInstruction,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (error: any) {
        console.error('AI Chat Error, switching to intelligent fallback:', error.message || error);
      }
    }

    // Fallback AI Advisor Chat Response
    const q = message.toLowerCase();
    let reply = '';

    if (
      q.includes('graph') ||
      q.includes('dijkstra') ||
      q.includes('algo') ||
      q.includes('cs') ||
      q.includes('code') ||
      q.includes('programming') ||
      q.includes('lab')
    ) {
      reply = `For your **Graph Lab & Computer Science** query:

🎯 **1. Key Algorithmic Concepts to Focus On:**
- **Graph Representations:** Master Adjacency Lists (O(V + E) space) vs Adjacency Matrices (O(V²) space).
- **Shortest Path & Traversal:** Review Dijkstra's Algorithm (priority queue implementation, O((V + E) log V)) and BFS for unweighted graphs.
- **Edge Cases:** Test single-node graphs, disconnected components, negative edge weights (Bellman-Ford), and cyclic structures.

⏱️ **2. Recommended 2-Hour Study Plan:**
1. **Block 1 (30 mins):** Trace Dijkstra/BFS on paper with a 5-vertex graph.
2. **Block 2 (50 mins):** Code the core graph data structure and priority queue logic.
3. **Block 3 (30 mins):** Run unit tests against edge cases (loops, empty graphs).
4. **Block 4 (10 mins):** Document time & space complexity in your lab report.`;
    } else if (q.includes('backprop') || q.includes('neural') || q.includes('machine learning') || q.includes('gradient')) {
      reply = `Here is an intuitive explanation of **Backpropagation**:

💡 **The Target Archery Coach Analogy:**
Imagine you are shooting arrows at a target (*Forward Pass*). You hit 3 inches above the bullseye (*Loss / Error Calculation*). Your coach analyzes your bow tension and arm angle (*Chain Rule / Gradients*) and says: *"Lower your arm by 2 degrees"* (*Weight Update*). You adjust your posture slightly and shoot again.

📐 **3 Core Steps:**
1. **Forward Pass:** Inputs pass through neural network layers to generate a prediction, and total error is calculated.
2. **Backward Pass:** Partial derivatives propagate backward using the calculus Chain Rule to calculate how much each weight contributed to the error.
3. **Gradient Descent:** Weights update using $w = w - \\alpha \\times \\frac{\\partial L}{\\partial w}$, reducing prediction error step-by-step.`;
    } else if (q.includes('bio') || q.includes('cellular') || q.includes('respiration') || q.includes('paper') || q.includes('biology')) {
      reply = `Here is an academic strategy for your **Biology Research & Writing**:

📝 **1. Paper Structure Breakdown:**
- **Introduction:** Clearly state your thesis on cellular energetics and mitochondrial ATP production.
- **Core Mechanisms:** Detail Glycolysis, the Krebs Cycle, and Electron Transport Chain oxidative phosphorylation.
- **Discussion:** Address enzyme regulation factors and physiological implications.

📌 **2. Next Actionable Steps:**
- Gather 3 peer-reviewed journal articles.
- Draft membrane potential calculations and pathway diagrams.
- Use our built-in **Flashcards** under Note Summarizer to memorize key enzymes!`;
    } else if (q.includes('math') || q.includes('linear') || q.includes('algebra') || q.includes('calculus') || q.includes('exam')) {
      reply = `For **Applied Linear Algebra & Math Exam Preparation**:

📐 **1. High-Priority Exam Topics:**
- **Eigenvalues & Eigenvectors:** Solve $\\det(A - \\lambda I) = 0$ and calculate null space basis vectors.
- **Matrix Transformations:** Practice Gaussian elimination, LU decomposition, and matrix orthogonality ($Q^T Q = I$).
- **Vector Spaces:** Verify linear independence, span, and subspace dimension rules.

💡 **2. Effective Study Method:**
- Work through 3 practice problems with formulas hidden (Active Recall).
- Redo any missed problems from scratch without checking solutions.
- Generate a practice quiz in the **Note Summarizer** tab!`;
    } else if (q.includes('plan') || q.includes('schedule') || q.includes('time') || q.includes('focus') || q.includes('pomodoro')) {
      reply = `Here is a custom **Focus & Time Management Plan**:

⏱️ **1. The 50/10 Pomodoro Routine:**
- **50 Minutes Deep Work:** Block all notifications and focus on 1 singular assignment.
- **10 Minutes Refresh:** Take a physical break away from screens (stretch, hydrate).

🎯 **2. Peak Energy Distribution:**
- **Morning (High Alertness):** Complex analytical work (Algorithms / Math).
- **Afternoon:** Research, writing, and group syncs.
- **Evening:** Light review, flashcard practice, and planning for tomorrow.`;
    } else if (q.startsWith('explain') || q.startsWith('what is') || q.startsWith('how does') || q.startsWith('define')) {
      const topic = message.replace(/^(explain|what is|how does|define)\s+/i, '').trim();
      reply = `Here is a structured breakdown of **${topic || message}**:

1. **Core Concept:** ${topic ? topic : message} is a key academic topic requiring structured analytical thinking.
2. **Key Mechanism:** Break down the subject into its primary inputs, transformation processes, and expected outcomes.
3. **Study Strategy:** Apply active recall by writing out definitions and testing yourself with flashcards.`;
    } else {
      reply = `Regarding your query about **"${message}"**:

🎯 **Recommended Action Plan:**
1. **Break it Down:** Divide "${message}" into 25-minute focus intervals.
2. **Active Recall:** Write down key concepts from memory before reviewing lecture slides.
3. **Practice Testing:** Use our Note Summarizer tab to instantly generate flashcards and quizzes!`;
    }

    return res.json({ reply });
  });

  // Express + Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyPulse server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

