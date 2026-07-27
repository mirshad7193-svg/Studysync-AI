import React, { useState } from 'react';
import { AIChatMessage } from '../types';
import { Sparkles, Send, Bot, User, X, Loader2, Lightbulb } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentContext?: any;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  studentContext,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hi Alex! I am your AI Study Advisor. Ask me anything about your assignments, study schedules, or lecture notes.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Suggest an optimal study plan for my upcoming graph lab',
    'Explain Backpropagation simply with an analogy',
    'How should I break down my Bio paper into subtasks?',
    'Give me 3 tips to maintain focus during 2-hour study sessions',
  ];

  const generateSmartAdvisorReply = (queryText: string): string => {
    const q = queryText.toLowerCase();

    // 1. Graph / CS / Algorithms / Code / Lab
    if (
      q.includes('graph') ||
      q.includes('dijkstra') ||
      q.includes('algo') ||
      q.includes('cs') ||
      q.includes('code') ||
      q.includes('programming') ||
      q.includes('lab')
    ) {
      return `For your **Graph Lab & Computer Science** query:

🎯 **1. Key Algorithmic Concepts to Focus On:**
- **Graph Representations:** Master Adjacency Lists (O(V + E) space) vs Adjacency Matrices (O(V²) space).
- **Shortest Path & Traversal:** Review Dijkstra's Algorithm (priority queue implementation, O((V + E) log V)) and BFS for unweighted graphs.
- **Edge Cases:** Test single-node graphs, disconnected components, negative edge weights (Bellman-Ford), and cyclic structures.

⏱️ **2. Recommended 2-Hour Study Plan:**
1. **Block 1 (30 mins):** Trace Dijkstra/BFS on paper with a 5-vertex graph.
2. **Block 2 (50 mins):** Code the core graph data structure and priority queue logic.
3. **Block 3 (30 mins):** Run unit tests against edge cases (loops, empty graphs).
4. **Block 4 (10 mins):** Document time & space complexity in your lab report.

Let me know if you want to break this down into specific subtasks in the Assignments tab!`;
    }

    // 2. Backpropagation / Neural Net / AI concept
    if (q.includes('backprop') || q.includes('neural') || q.includes('machine learning') || q.includes('gradient')) {
      return `Here is an intuitive explanation of **Backpropagation**:

💡 **The Target Archery Coach Analogy:**
Imagine you are shooting arrows at a target (*Forward Pass*). You hit 3 inches above the bullseye (*Loss / Error Calculation*). Your coach analyzes your bow tension and arm angle (*Chain Rule / Gradients*) and says: *"Lower your arm by 2 degrees"* (*Weight Update*). You adjust your posture slightly and shoot again.

📐 **3 Core Steps:**
1. **Forward Pass:** Inputs pass through neural network layers to generate a prediction, and total error is calculated.
2. **Backward Pass:** Partial derivatives propagate backward using the calculus Chain Rule to calculate how much each weight contributed to the error.
3. **Gradient Descent:** Weights update using $w = w - \\alpha \\times \\frac{\\partial L}{\\partial w}$, reducing prediction error step-by-step.`;
    }

    // 3. Biology / Research Paper / Cellular Respiration
    if (q.includes('bio') || q.includes('cellular') || q.includes('respiration') || q.includes('paper') || q.includes('biology')) {
      return `Here is an academic strategy for your **Biology Research & Writing**:

📝 **1. Paper Structure Breakdown:**
- **Introduction:** Clearly state your thesis on cellular energetics and mitochondrial ATP production.
- **Core Mechanisms:** Detail Glycolysis, the Krebs Cycle, and Electron Transport Chain oxidative phosphorylation.
- **Discussion:** Address enzyme regulation factors and physiological implications.

📌 **2. Next Actionable Steps:**
- Gather 3 peer-reviewed journal articles.
- Draft membrane potential calculations and pathway diagrams.
- Use our built-in **Flashcards** under Note Summarizer to memorize key enzymes!`;
    }

    // 4. Math / Linear Algebra / Calculus / Exams
    if (q.includes('math') || q.includes('linear') || q.includes('algebra') || q.includes('calculus') || q.includes('exam')) {
      return `For **Applied Linear Algebra & Math Exam Preparation**:

📐 **1. High-Priority Exam Topics:**
- **Eigenvalues & Eigenvectors:** Solve $\\det(A - \\lambda I) = 0$ and calculate null space basis vectors.
- **Matrix Transformations:** Practice Gaussian elimination, LU decomposition, and matrix orthogonality ($Q^T Q = I$).
- **Vector Spaces:** Verify linear independence, span, and subspace dimension rules.

💡 **2. Effective Study Method:**
- Work through 3 practice problems with formulas hidden (Active Recall).
- Redo any missed problems from scratch without checking solutions.
- Generate a practice quiz in the **Note Summarizer** tab!`;
    }

    // 5. Schedule / Plan / Focus / Pomodoro / Time
    if (q.includes('plan') || q.includes('schedule') || q.includes('time') || q.includes('focus') || q.includes('pomodoro')) {
      return `Here is a custom **Focus & Time Management Plan**:

⏱️ **1. The 50/10 Pomodoro Routine:**
- **50 Minutes Deep Work:** Block all notifications and focus on 1 singular assignment.
- **10 Minutes Refresh:** Take a physical break away from screens (stretch, hydrate).

🎯 **2. Peak Energy Distribution:**
- **Morning (High Alertness):** Complex analytical work (Algorithms / Math).
- **Afternoon:** Research, writing, and group syncs.
- **Evening:** Light review, flashcard practice, and planning for tomorrow.

You can use the **Focus Room** timer in the top bar to track your sessions!`;
    }

    // 6. Explanation / Definition requests
    if (q.startsWith('explain') || q.startsWith('what is') || q.startsWith('how does') || q.startsWith('define')) {
      const topic = queryText.replace(/^(explain|what is|how does|define)\s+/i, '').trim();
      return `Here is a structured breakdown of **${topic || queryText}**:

1. **Core Concept:** ${topic ? topic : queryText} is a key academic topic requiring structured analytical thinking.
2. **Key Mechanism:** Break down the subject into its primary inputs, transformation processes, and expected outcomes.
3. **Study Strategy:** Apply active recall by writing out definitions and testing yourself with flashcards.

Would you like me to help break this topic into specific subtasks for your schedule?`;
    }

    // 7. General Custom Response
    return `Regarding your question about **"${queryText}"**:

🎯 **Recommended Action Plan:**
1. **Break it Down:** Divide "${queryText}" into 25-minute focus intervals.
2. **Active Recall:** Write down key concepts from memory before reviewing lecture slides.
3. **Practice Testing:** Use our Note Summarizer tab to instantly generate flashcards and quizzes!

Let me know if you would like study tips for a specific subject or upcoming deadline!`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: studentContext,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || generateSmartAdvisorReply(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Chat fallback activated:', err);
      // Dynamic query-aware response tailored to what the user asked
      const fallbackMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: generateSmartAdvisorReply(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">AI Study Companion</h3>
              <p className="text-[10px] text-indigo-200">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-amber-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className={`text-[9px] block text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-indigo-600 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI Study Companion is thinking...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Suggested Questions</span>
          </p>
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-medium text-slate-700 transition-colors whitespace-nowrap"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask your AI advisor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
