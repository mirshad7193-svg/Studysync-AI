import React, { useState, useEffect } from 'react';
import { Assignment, StudySession, GroupProject, LectureNote } from './types';
import { 
  initialAssignments, 
  initialStudySessions, 
  initialGroupProjects, 
  initialNotes 
} from './mockData';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AssignmentsView } from './components/AssignmentsView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { GroupProjectsView } from './components/GroupProjectsView';
import { NoteSummarizerView } from './components/NoteSummarizerView';
import { FocusTimerModal } from './components/FocusTimerModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Persistence with localStorage fallback
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('studypulse_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('studypulse_sessions');
    return saved ? JSON.parse(saved) : initialStudySessions;
  });

  const [groupProjects, setGroupProjects] = useState<GroupProject[]>(() => {
    const saved = localStorage.getItem('studypulse_projects');
    return saved ? JSON.parse(saved) : initialGroupProjects;
  });

  const [notes, setNotes] = useState<LectureNote[]>(() => {
    const saved = localStorage.getItem('studypulse_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // UI Modals
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isAiScheduleModalOpen, setIsAiScheduleModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [activeFocusMinutes, setActiveFocusMinutes] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('studypulse_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('studypulse_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem('studypulse_projects', JSON.stringify(groupProjects));
  }, [groupProjects]);

  useEffect(() => {
    localStorage.setItem('studypulse_notes', JSON.stringify(notes));
  }, [notes]);

  // Assignment Handlers
  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const created: Assignment = {
      ...newAssignment,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [created, ...prev]);
  };

  const handleUpdateAssignment = (updated: Assignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'completed' ? 'todo' : 'completed' } : a
      )
    );
  };

  // Study Session Handlers
  const handleAddSession = (newSession: Omit<StudySession, 'id'>) => {
    const created: StudySession = {
      ...newSession,
      id: `ses-${Date.now()}`,
    };
    setStudySessions((prev) => [created, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSessionComplete = (id: string) => {
    setStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleImportAiSessions = (newSessions: Omit<StudySession, 'id'>[]) => {
    const created = newSessions.map((s, idx) => ({
      ...s,
      id: `ses-ai-${Date.now()}-${idx}`,
    }));
    setStudySessions((prev) => [...created, ...prev]);
  };

  // Group Project Handlers
  const handleUpdateProject = (updated: GroupProject) => {
    setGroupProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProject = (newProject: Omit<GroupProject, 'id'>) => {
    const created: GroupProject = {
      ...newProject,
      id: `proj-${Date.now()}`,
    };
    setGroupProjects((prev) => [created, ...prev]);
  };

  // Notes Handler
  const handleSaveGeneratedNote = (newNote: LectureNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const pendingCount = assignments.filter((a) => a.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        pendingAssignmentCount={pendingCount}
        activeFocusMinutes={activeFocusMinutes}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            assignments={assignments}
            studySessions={studySessions}
            groupProjects={groupProjects}
            notes={notes}
            setActiveTab={setActiveTab}
            onToggleAssignment={handleToggleAssignmentStatus}
            onOpenAiScheduleModal={() => {
              setActiveTab('planner');
              setIsAiScheduleModalOpen(true);
            }}
            onStartStudySession={(session) => setIsFocusTimerOpen(true)}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onToggleAssignment={handleToggleAssignmentStatus}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlannerView
            studySessions={studySessions}
            assignments={assignments}
            onAddSession={handleAddSession}
            onDeleteSession={handleDeleteSession}
            onToggleSessionComplete={handleToggleSessionComplete}
            onImportAiSessions={handleImportAiSessions}
            onStartStudySession={(s) => setIsFocusTimerOpen(true)}
            isAiModalOpen={isAiScheduleModalOpen}
            setIsAiModalOpen={setIsAiScheduleModalOpen}
          />
        )}

        {activeTab === 'groups' && (
          <GroupProjectsView
            projects={groupProjects}
            onUpdateProject={handleUpdateProject}
            onAddProject={handleAddProject}
          />
        )}

        {activeTab === 'summarizer' && (
          <NoteSummarizerView
            notes={notes}
            onSaveGeneratedNote={handleSaveNote => handleSaveGeneratedNote(handleSaveNote)}
          />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onLogFocusMinutes={(mins) => setActiveFocusMinutes((prev) => prev + mins)}
      />

      <AIAssistantDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        studentContext={{
          assignmentsCount: assignments.length,
          pendingAssignmentsCount: pendingCount,
          upcomingDeadlines: assignments.slice(0, 3).map((a) => `${a.title} due ${a.dueDate}`),
          courses: Array.from(new Set(assignments.map((a) => a.course))),
        }}
      />
    </div>
  );
}
