import { Assignment, StudySession, GroupProject, LectureNote } from './types';

// Helper to calculate relative date string YYYY-MM-DD
export function getRelativeDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Data Structures & Algorithms Graph Lab',
    course: 'CS 301 - Computer Science',
    dueDate: getRelativeDate(1),
    dueTime: '23:59',
    priority: 'high',
    status: 'in_progress',
    estimatedHours: 4,
    notes: 'Implement Dijkstra and A* search algorithm in TypeScript. Test edge cases with disconnected graphs.',
    subtasks: [
      { id: 'sub-1', title: 'Implement Graph Adjacency List', completed: true },
      { id: 'sub-2', title: 'Implement Dijkstra algorithm with MinHeap', completed: true },
      { id: 'sub-3', title: 'Implement A* heuristics', completed: false },
      { id: 'sub-4', title: 'Write benchmark tests and report', completed: false },
    ],
    tags: ['Coding', 'Algorithms', 'Lab'],
  },
  {
    id: 'asg-2',
    title: 'Cellular Respiration Research Paper',
    course: 'BIO 210 - Molecular Biology',
    dueDate: getRelativeDate(3),
    dueTime: '17:00',
    priority: 'high',
    status: 'todo',
    estimatedHours: 5,
    notes: 'Include metabolic pathways diagram, ATP yield analysis, and oxidative phosphorylation breakdown.',
    subtasks: [
      { id: 'sub-201', title: 'Literature review on mitochondrial ATP synthase', completed: false },
      { id: 'sub-202', title: 'Draft section 1: Glycolysis pathway', completed: false },
      { id: 'sub-203', title: 'Draft section 2: Krebs Cycle', completed: false },
    ],
    tags: ['Research', 'Writing', 'Biology'],
  },
  {
    id: 'asg-3',
    title: 'Calculus III Problem Set 6',
    course: 'MATH 220 - Multivariable Calculus',
    dueDate: getRelativeDate(2),
    dueTime: '12:00',
    priority: 'medium',
    status: 'in_progress',
    estimatedHours: 3,
    notes: 'Double and triple integrals over general regions. Green Theorem practice problems.',
    subtasks: [
      { id: 'sub-301', title: 'Problems 1-5: Polar coordinates integration', completed: true },
      { id: 'sub-302', title: 'Problems 6-10: Surface integrals', completed: false },
    ],
    tags: ['Math', 'Homework'],
  },
  {
    id: 'asg-4',
    title: 'World War II Economic History Essay',
    course: 'HIST 105 - Modern World History',
    dueDate: getRelativeDate(5),
    dueTime: '23:59',
    priority: 'medium',
    status: 'todo',
    estimatedHours: 4,
    notes: 'Analyze post-war industrial reconstruction in Europe and Marshall Plan effects.',
    subtasks: [
      { id: 'sub-401', title: 'Gather primary sources', completed: false },
      { id: 'sub-402', title: 'Create thesis statement and outline', completed: false },
    ],
    tags: ['Essay', 'History'],
  },
  {
    id: 'asg-5',
    title: 'UX/UI User Flow Wireframe Presentation',
    course: 'DES 240 - Product Design',
    dueDate: getRelativeDate(6),
    dueTime: '15:30',
    priority: 'low',
    status: 'completed',
    estimatedHours: 2,
    notes: 'Completed wireframes in Figma and prepared 5-slide deck.',
    subtasks: [
      { id: 'sub-501', title: 'User research persona cards', completed: true },
      { id: 'sub-502', title: 'Figma interactive prototype link', completed: true },
    ],
    tags: ['Design', 'Group Prep'],
  },
];

export const initialStudySessions: StudySession[] = [
  {
    id: 'ses-1',
    title: 'Algorithms Graph Lab Coding Session',
    course: 'CS 301 - Computer Science',
    date: getRelativeDate(0),
    startTime: '09:00',
    endTime: '11:00',
    type: 'assignment',
    completed: true,
    notes: 'Finished Dijkstra implementation!',
  },
  {
    id: 'ses-2',
    title: 'Biology Chapter 8 Deep Dive',
    course: 'BIO 210 - Molecular Biology',
    date: getRelativeDate(0),
    startTime: '14:00',
    endTime: '16:00',
    type: 'deep_work',
    completed: false,
    aiSuggested: true,
    notes: 'AI Recommended: High focus period before deadline in 3 days.',
  },
  {
    id: 'ses-3',
    title: 'Calculus Triple Integrals Practice',
    course: 'MATH 220 - Multivariable Calculus',
    date: getRelativeDate(1),
    startTime: '10:00',
    endTime: '12:00',
    type: 'review',
    completed: false,
    aiSuggested: true,
  },
  {
    id: 'ses-4',
    title: 'History Primary Sources Review',
    course: 'HIST 105 - Modern World History',
    date: getRelativeDate(2),
    startTime: '15:00',
    endTime: '16:30',
    type: 'review',
    completed: false,
  },
  {
    id: 'ses-5',
    title: 'Bio Group Sync & Final Review',
    course: 'BIO 210 - Molecular Biology',
    date: getRelativeDate(2),
    startTime: '17:00',
    endTime: '18:30',
    type: 'group',
    completed: false,
  },
];

export const initialGroupProjects: GroupProject[] = [
  {
    id: 'proj-1',
    title: 'Campus Solar Energy Feasibility Study',
    course: 'ENV 300 - Environmental Studies',
    description: 'Collaborative analysis calculating solar panel ROI, rooftop energy potential, and carbon reduction for university dormitories.',
    dueDate: getRelativeDate(7),
    members: [
      { id: 'm-1', name: 'You (Alex Chen)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Leader', email: 'alex.chen@university.edu' },
      { id: 'm-2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', role: 'Researcher', email: 'sarah.j@university.edu' },
      { id: 'm-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', role: 'Designer', email: 'marcus.v@university.edu' },
      { id: 'm-4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', role: 'Writer', email: 'elena.r@university.edu' },
    ],
    tasks: [
      { id: 'pt-1', title: 'Rooftop surface area GIS data collection', assignedToId: 'm-2', status: 'completed', dueDate: getRelativeDate(-1), priority: 'high' },
      { id: 'pt-2', title: 'Solar irradiance & annual kWh generation calculation', assignedToId: 'm-1', status: 'in_progress', dueDate: getRelativeDate(2), priority: 'high' },
      { id: 'pt-3', title: 'Infographic design for final slide deck', assignedToId: 'm-3', status: 'in_progress', dueDate: getRelativeDate(4), priority: 'medium' },
      { id: 'pt-4', title: 'Draft Executive Summary & Policy Recommendations', assignedToId: 'm-4', status: 'todo', dueDate: getRelativeDate(5), priority: 'medium' },
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Project Proposal & Methodology',
        content: '# Solar Energy Campus Project\n\n## Objective\nTo evaluate installing 500kW photovoltaic arrays across North Campus dormitories.\n\n## Key Data Points\n- Average sunlight hours: 4.8 hrs/day\n- Estimated setup cost: $320,000\n- Projected payback period: 6.2 years',
        lastUpdated: 'Yesterday at 4:15 PM',
        updatedBy: 'Sarah Jenkins',
      },
      {
        id: 'doc-2',
        title: 'Interview Notes - University Sustainability Office',
        content: 'Director confirmed funding matching program for green energy initiatives up to $150k. Requires detailed carbon offset metrics.',
        lastUpdated: 'Today at 10:30 AM',
        updatedBy: 'Alex Chen',
      },
    ],
    discussion: [
      { id: 'c-1', senderName: 'Sarah Jenkins', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', message: 'I updated the GIS solar map data for North Campus in Document #1!', timestamp: 'Yesterday 3:45 PM' },
      { id: 'c-2', senderName: 'Alex Chen', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', message: 'Awesome! I will use those numbers for the ROI math in my study session tonight.', timestamp: 'Yesterday 4:00 PM' },
      { id: 'c-3', senderName: 'Marcus Vance', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', message: 'Let me know when the chart values are finalized so I can build the presentation deck.', timestamp: 'Today 9:15 AM' },
    ],
  },
  {
    id: 'proj-2',
    title: 'Smart Health Monitoring Mobile App Spec',
    course: 'CS 350 - Software Engineering',
    description: 'System architecture, API design, and wireframes for a wearable health tracking application.',
    dueDate: getRelativeDate(12),
    members: [
      { id: 'm-1', name: 'You (Alex Chen)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Developer', email: 'alex.chen@university.edu' },
      { id: 'm-5', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', role: 'Leader', email: 'david.k@university.edu' },
      { id: 'm-6', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Developer', email: 'priya.s@university.edu' },
    ],
    tasks: [
      { id: 'pt-201', title: 'ER Diagram & Relational Schema', assignedToId: 'm-1', status: 'completed', dueDate: getRelativeDate(-2), priority: 'high' },
      { id: 'pt-202', title: 'Rest API OpenAPI Specification', assignedToId: 'm-6', status: 'in_progress', dueDate: getRelativeDate(4), priority: 'high' },
      { id: 'pt-203', title: 'Deployment Pipeline & Docker setup', assignedToId: 'm-5', status: 'todo', dueDate: getRelativeDate(8), priority: 'medium' },
    ],
    documents: [
      {
        id: 'doc-201',
        title: 'System Requirements Specification (SRS)',
        content: '# System Requirements\n1. Heart rate telemetry streaming via WebSocket\n2. Real-time emergency alert thresholding\n3. End-to-end encrypted health data store',
        lastUpdated: '3 days ago',
        updatedBy: 'David Kim',
      },
    ],
    discussion: [
      { id: 'c-201', senderName: 'David Kim', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', message: 'Team meeting on Discord tomorrow at 6 PM to review API endpoints.', timestamp: '2 days ago' },
    ],
  },
];

export const initialNotes: LectureNote[] = [
  {
    id: 'note-1',
    title: 'Lecture 12: Neural Networks & Backpropagation',
    course: 'CS 301 - Artificial Intelligence',
    createdAt: getRelativeDate(-2),
    rawContent: `Artificial Neural Networks (ANNs) are computational models inspired by biological neural networks. A standard feedforward neural network consists of an input layer, one or more hidden layers, and an output layer.

Each neuron computes a weighted sum of its inputs plus a bias term: z = w1*x1 + w2*x2 + ... + b. It then passes z through a non-linear activation function f(z) like ReLU (Rectified Linear Unit), Sigmoid, or Tanh.

Backpropagation is the gradient descent algorithm used to optimize network weights. It computes the gradient of the loss function with respect to each weight using the mathematical chain rule. 

Key Steps in Backpropagation:
1. Forward pass: Compute predictions and loss L.
2. Backward pass: Calculate partial derivatives dL/dw working backwards from output to input layer.
3. Weight update: Update weights w_new = w_old - alpha * (dL/dw), where alpha is the learning rate.

Common Loss Functions:
- Mean Squared Error (MSE) for regression
- Cross-Entropy Loss for classification tasks.`,
    summary: 'Overview of artificial neural networks, neuron activation mathematics (weighted sum + activation function), and the backpropagation gradient descent algorithm using the chain rule for weight optimization.',
    keyTakeaways: [
      'Feedforward NNs consist of Input, Hidden, and Output layers.',
      'Activation functions (ReLU, Sigmoid, Tanh) introduce non-linearity.',
      'Backpropagation applies the chain rule backward from the output layer to calculate weight gradients.',
      'Weight updates follow: w_new = w_old - (learning_rate * dL/dw).',
    ],
    flashcards: [
      {
        id: 'fc-1',
        question: 'What is the mathematical purpose of an activation function in a neural network?',
        answer: 'To introduce non-linearity, allowing the neural network to learn complex non-linear decision boundaries.',
        mastered: true,
      },
      {
        id: 'fc-2',
        question: 'Which calculus principle is fundamental to the backpropagation algorithm?',
        answer: 'The Chain Rule for partial derivatives.',
        mastered: false,
      },
      {
        id: 'fc-3',
        question: 'What is the formula for weight update in Gradient Descent?',
        answer: 'w_new = w_old - learning_rate * (dL/dw).',
        mastered: false,
      },
    ],
    quizQuestions: [
      {
        id: 'qq-1',
        question: 'Which loss function is most commonly used for classification problems?',
        options: ['Mean Squared Error (MSE)', 'Cross-Entropy Loss', 'Mean Absolute Error (MAE)', 'Huber Loss'],
        correctAnswerIndex: 1,
        explanation: 'Cross-Entropy Loss measures the performance of a classification model whose output is a probability value between 0 and 1.',
      },
      {
        id: 'qq-2',
        question: 'What is the equation calculated inside a single neuron prior to the activation function?',
        options: ['z = w * x^2 + b', 'z = sum(w_i * x_i) + b', 'z = activation(x / w)', 'z = e^(w * x)'],
        correctAnswerIndex: 1,
        explanation: 'A neuron computes the dot product of input vectors and weight vectors plus a bias term b.',
      },
    ],
  },
];
