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
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasKey: !!apiKey });
  });

  // Endpoint 1: Suggest Study Schedule
  app.post('/api/ai/suggest-schedule', async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const { assignments, preferences } = req.body;
      const prompt = `
You are an expert AI academic schedule planner for college and university students.
Analyze the student's assignments, deadlines, priorities, and study preferences to generate an optimal study schedule.

Student Preferences:
- Peak Alertness Period: ${preferences?.peakHours || 'Evening (6 PM - 10 PM)'}
- Preferred Study Block Duration: ${preferences?.sessionDuration || '2 hours'}
- Target Max Study Hours/Day: ${preferences?.maxHoursPerDay || '4 hours'}

Current Assignments:
${JSON.stringify(assignments || [], null, 2)}

Generate 4-6 realistic, actionable study sessions distributed across the upcoming days (starting from today).
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

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error('Schedule AI Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate schedule suggestions' });
    }
  });

  // Endpoint 2: Note Summarizer, Flashcards & Quiz Generator
  app.post('/api/ai/summarize-notes', async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const { rawContent, title, course } = req.body;
      if (!rawContent || rawContent.trim().length === 0) {
        return res.status(400).json({ error: 'Note content is required' });
      }

      const prompt = `
Analyze the following lecture notes/study material for the course "${course || 'General Study'}":
Title: "${title || 'Lecture Notes'}"

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

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error('Note Summarizer AI Error:', error);
      res.status(500).json({ error: error.message || 'Failed to summarize notes' });
    }
  });

  // Endpoint 3: Break assignment into actionable subtasks
  app.post('/api/ai/breakdown-task', async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const { title, course, notes, estimatedHours } = req.body;
      const prompt = `
Break down this assignment into 3-5 clear, concrete, sequential subtasks:
Assignment: "${title}"
Course: "${course}"
Estimated total hours: ${estimatedHours || 3} hours
Notes/Details: "${notes || 'None'}"
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

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error('Task Breakdown Error:', error);
      res.status(500).json({ error: error.message || 'Failed to break down task' });
    }
  });

  // Endpoint 4: AI Study Assistant Chat
  app.post('/api/ai/chat', async (req, res) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const { message, context, history } = req.body;

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

      res.json({ reply: response.text || 'I am here to help you study!' });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      res.status(500).json({ error: error.message || 'Chat assistant error' });
    }
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
