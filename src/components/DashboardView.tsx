import React from 'react';
import { Assignment, StudySession, GroupProject, LectureNote } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Play, 
  Plus,
  TrendingUp,
  FileText
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface DashboardViewProps {
  assignments: Assignment[];
  studySessions: StudySession[];
  groupProjects: GroupProject[];
  notes: LectureNote[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleAssignment: (id: string) => void;
  onOpenAiScheduleModal: () => void;
  onStartStudySession: (session: StudySession) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assignments,
  studySessions,
  groupProjects,
  notes,
  setActiveTab,
  onToggleAssignment,
  onOpenAiScheduleModal,
  onStartStudySession,
}) => {
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed');
  const completedAssignments = assignments.filter((a) => a.status === 'completed');
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySessions = studySessions.filter((s) => s.date === todayDateStr);

  const totalStudyHours = studySessions.reduce((acc, s) => {
    const start = parseInt(s.startTime.split(':')[0], 10);
    const end = parseInt(s.endTime.split(':')[0], 10);
    return acc + Math.max(1, end - start);
  }, 0);

  // Urgent upcoming assignments (sorted by date)
  const urgentAssignments = [...pendingAssignments]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Semester Fall 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
            You have <span className="text-amber-300 font-bold">{pendingAssignments.length} pending assignments</span> this week. Your AI Study Advisor has prepared an optimized schedule to balance your workload.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenAiScheduleModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-md transition-all group"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Study Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTab('summarizer')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>Summarize Lecture Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{pendingAssignments.length}</p>
            <p className="text-[11px] text-amber-600 font-medium">Due within 7 days</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{completedAssignments.length}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Great momentum!</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Scheduled Study</p>
            <p className="text-2xl font-bold text-slate-900">{totalStudyHours} hrs</p>
            <p className="text-[11px] text-indigo-600 font-medium">Across {studySessions.length} sessions</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Group Projects</p>
            <p className="text-2xl font-bold text-slate-900">{groupProjects.length}</p>
            <p className="text-[11px] text-blue-600 font-medium">Active team workspaces</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span>Upcoming Assignments</span>
                </h2>
                <p className="text-xs text-slate-500">Prioritized by deadline & workload</p>
              </div>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <span>View All ({assignments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentAssignments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-500">No pending assignments on your plate right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentAssignments.map((assignment) => {
                  const isHigh = assignment.priority === 'high';
                  return (
                    <div
                      key={assignment.id}
                      className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white transition-all flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => onToggleAssignment(assignment.id)}
                          className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            assignment.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-indigo-500 bg-white'
                          }`}
                        >
                          {assignment.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                              {assignment.course}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                isHigh
                                  ? 'bg-rose-100 text-rose-700'
                                  : assignment.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {assignment.priority} Priority
                            </span>
                          </div>
                          <h3 className={`font-semibold text-slate-900 text-sm mt-1 group-hover:text-indigo-600 transition-colors ${
                            assignment.status === 'completed' ? 'line-through text-slate-400' : ''
                          }`}>
                            {assignment.title}
                          </h3>
                          {assignment.notes && (
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{assignment.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <div className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due {assignment.dueDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">~{assignment.estimatedHours}h est.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Note Summarizer Quick Card */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Note Summarizer & Flashcards</span>
              </div>
              <h3 className="font-bold text-lg">Turn raw notes into study guides instantly</h3>
              <p className="text-xs text-emerald-200 max-w-xl">
                Paste lecture transcripts or study docs. Gemini AI will automatically create summaries, key takeaways, flashcard decks, and practice quizzes.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('summarizer')}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Open Summarizer
            </button>
          </div>
        </div>

        {/* Right Col: Today's Schedule & Quick Assistant */}
        <div className="space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Today's Study Plan</span>
              </h2>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Planner View
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-medium text-slate-700">No sessions scheduled for today yet.</p>
                <button
                  onClick={onOpenAiScheduleModal}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
                >
                  Generate with AI
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-indigo-600">
                          {session.startTime} - {session.endTime}
                        </span>
                        {session.aiSuggested && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            AI Pick
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900 text-xs mt-0.5">{session.title}</p>
                      <p className="text-[11px] text-slate-500">{session.course}</p>
                    </div>

                    <button
                      onClick={() => onStartStudySession(session)}
                      className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      title="Start Pomodoro Focus Session"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Projects Quick Access */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Group Workspaces</span>
              </h2>
              <button
                onClick={() => setActiveTab('groups')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Go to Groups
              </button>
            </div>

            <div className="space-y-3">
              {groupProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setActiveTab('groups')}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 rounded">
                        {project.course}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-xs mt-1">{project.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {project.members.map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                          title={`${m.name} (${m.role})`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-slate-600">
                      {project.tasks.filter((t) => t.status === 'completed').length}/{project.tasks.length} tasks done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
