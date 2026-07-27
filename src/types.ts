export type Priority = 'high' | 'medium' | 'low';
export type AssignmentStatus = 'todo' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: AssignmentStatus;
  estimatedHours: number;
  notes?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  tags?: string[];
}

export interface StudySession {
  id: string;
  title: string;
  course: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'review' | 'exam_prep' | 'group' | 'deep_work' | 'assignment';
  completed: boolean;
  aiSuggested?: boolean;
  notes?: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'Leader' | 'Researcher' | 'Designer' | 'Developer' | 'Writer' | 'Contributor';
  email: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignedToId: string;
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  priority: Priority;
}

export interface ProjectDoc {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isAi?: boolean;
}

export interface GroupProject {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  members: Member[];
  tasks: ProjectTask[];
  documents: ProjectDoc[];
  discussion: ChatMessage[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LectureNote {
  id: string;
  title: string;
  course: string;
  createdAt: string;
  rawContent: string;
  summary: string;
  keyTakeaways: string[];
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
