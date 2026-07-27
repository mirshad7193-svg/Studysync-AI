import React, { useState } from 'react';
import { StudySession, Assignment } from '../types';
import { getRelativeDate } from '../mockData';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Play, 
  Trash2, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Info
} from 'lucide-react';

interface StudyPlannerViewProps {
  studySessions: StudySession[];
  assignments: Assignment[];
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  onDeleteSession: (id: string) => void;
  onToggleSessionComplete: (id: string) => void;
  onImportAiSessions: (sessions: Omit<StudySession, 'id'>[]) => void;
  onStartStudySession: (session: StudySession) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  studySessions,
  assignments,
  onAddSession,
  onDeleteSession,
  onToggleSessionComplete,
  onImportAiSessions,
  onStartStudySession,
  isAiModalOpen,
  setIsAiModalOpen,
}) => {
  // AI Modal options state
  const [peakHours, setPeakHours] = useState('Evening (6 PM - 10 PM)');
  const [sessionDuration, setSessionDuration] = useState('2 hours');
  const [maxHoursPerDay, setMaxHoursPerDay] = useState('4 hours');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResultAdvice, setAiResultAdvice] = useState<string | null>(null);
  const [aiSuggestedList, setAiSuggestedList] = useState<any[]>([]);

  // Manual session modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS 301 - Computer Science');
  const [newDate, setNewDate] = useState(() => getRelativeDate(0));
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('16:00');
  const [newType, setNewType] = useState<StudySession['type']>('review');

  // Days list for weekly view
  const days = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { offset, dateStr, dayName, dayNum };
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string>(days[0].dateStr);

  const activeDaySessions = studySessions.filter((s) => s.date === selectedDateStr);

  // Call AI Endpoint to suggest schedule
  const handleGenerateAiSchedule = async () => {
    try {
      setIsGeneratingAi(true);
      setAiResultAdvice(null);
      setAiSuggestedList([]);

      const response = await fetch('/api/ai/suggest-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignments,
          preferences: {
            peakHours,
            sessionDuration,
            maxHoursPerDay,
          },
        }),
      });

      const data = await response.json();
      if (data.advice) {
        setAiResultAdvice(data.advice);
      }
      if (data.suggestedSessions && Array.isArray(data.suggestedSessions)) {
        setAiSuggestedList(data.suggestedSessions);
      }
    } catch (err) {
      console.error('Failed to generate AI schedule:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiSessions = () => {
    if (aiSuggestedList.length === 0) return;

    const formattedSessions: Omit<StudySession, 'id'>[] = aiSuggestedList.map((item) => ({
      title: item.title,
      course: item.course,
      date: getRelativeDate(item.dateOffsetDays ?? 0),
      startTime: item.startTime,
      endTime: item.endTime,
      type: item.type || 'deep_work',
      completed: false,
      aiSuggested: true,
      notes: item.reasoning,
    }));

    onImportAiSessions(formattedSessions);
    setIsAiModalOpen(false);
    setAiResultAdvice(null);
    setAiSuggestedList([]);
  };

  const handleAddManualSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddSession({
      title: newTitle.trim(),
      course: newCourse,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      type: newType,
      completed: false,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const typeBadges: Record<StudySession['type'], { label: string; color: string }> = {
    deep_work: { label: 'Deep Work', color: 'bg-indigo-100 text-indigo-800' },
    exam_prep: { label: 'Exam Prep', color: 'bg-rose-100 text-rose-800' },
    review: { label: 'Review', color: 'bg-amber-100 text-amber-800' },
    group: { label: 'Group Study', color: 'bg-blue-100 text-blue-800' },
    assignment: { label: 'Assignment', color: 'bg-emerald-100 text-emerald-800' },
  };

  return (
    <div className="space-y-6">
      {/* View Title & AI Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Study Schedule & Planner</h1>
          <p className="text-xs text-slate-500">Plan exam prep, revision blocks, and group syncs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>AI Schedule Optimizer</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Days Selector Strip */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        {days.map((day) => {
          const isSelected = day.dateStr === selectedDateStr;
          const countForDay = studySessions.filter((s) => s.date === day.dateStr).length;

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDateStr(day.dateStr)}
              className={`flex-1 min-w-[70px] py-3 px-2 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
              }`}
            >
              <p className={`text-[10px] uppercase font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                {day.dayName}
              </p>
              <p className="text-lg font-extrabold mt-0.5">{day.dayNum}</p>
              {countForDay > 0 && (
                <span
                  className={`inline-block w-2 h-2 rounded-full mt-1 ${
                    isSelected ? 'bg-amber-300' : 'bg-indigo-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Schedule for {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{activeDaySessions.length} session blocks</span>
        </div>

        {activeDaySessions.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">No study blocks scheduled for this day</p>
            <p className="text-xs text-slate-500">Let AI suggest a time block or create a manual study session.</p>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              Optimize Day with AI
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDaySessions.map((session) => {
              const badge = typeBadges[session.type] || { label: session.type, color: 'bg-slate-100 text-slate-700' };

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    session.completed
                      ? 'bg-slate-50/60 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => onToggleSessionComplete(session.id)}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        session.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-indigo-500 bg-white'
                      }`}
                    >
                      {session.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-600">
                          {session.startTime} - {session.endTime}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.color}`}>
                          {badge.label}
                        </span>
                        {session.aiSuggested && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center space-x-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI Pick</span>
                          </span>
                        )}
                      </div>

                      <h3 className={`font-bold text-slate-900 text-sm mt-1 ${session.completed ? 'line-through text-slate-400' : ''}`}>
                        {session.title}
                      </h3>
                      <p className="text-xs text-slate-500">{session.course}</p>

                      {session.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                          💡 {session.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onStartStudySession(session)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Focus Session</span>
                    </button>

                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Schedule Optimizer Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">AI Study Schedule Optimizer</h2>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Gemini AI will analyze your upcoming assignment deadlines, priorities, and personal study energy windows to craft an optimal schedule.
            </p>

            {/* Form Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Peak Focus Window</label>
                <select
                  value={peakHours}
                  onChange={(e) => setPeakHours(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 font-medium"
                >
                  <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                  <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                  <option value="Evening (6 PM - 10 PM)">Evening (6 PM - 10 PM)</option>
                  <option value="Night Owl (10 PM - 2 AM)">Night Owl (10 PM - 2 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Session Block Duration</label>
                <select
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 font-medium"
                >
                  <option value="1 hour">1 Hour</option>
                  <option value="1.5 hours">1.5 Hours</option>
                  <option value="2 hours">2 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Max Daily Hours</label>
                <select
                  value={maxHoursPerDay}
                  onChange={(e) => setMaxHoursPerDay(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 font-medium"
                >
                  <option value="2 hours">2 Hours / Day</option>
                  <option value="4 hours">4 Hours / Day</option>
                  <option value="6 hours">6 Hours / Day</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAiSchedule}
              disabled={isGeneratingAi}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing workload & priorities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Recommended Schedule</span>
                </>
              )}
            </button>

            {/* AI Results */}
            {aiResultAdvice && (
              <div className="space-y-4 pt-3 border-t">
                <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-2">
                  <h4 className="font-bold text-indigo-900 text-xs flex items-center space-x-1.5">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>AI Strategy Rationale</span>
                  </h4>
                  <p className="text-xs text-indigo-950 leading-relaxed">{aiResultAdvice}</p>
                </div>

                {aiSuggestedList.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs">
                      Suggested Sessions ({aiSuggestedList.length})
                    </h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {aiSuggestedList.map((item, i) => (
                        <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-indigo-600">
                                Day +{item.dateOffsetDays} ({item.startTime} - {item.endTime})
                              </span>
                              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                {item.course}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-800 mt-0.5">{item.title}</p>
                            {item.reasoning && <p className="text-[11px] text-slate-500 mt-0.5">{item.reasoning}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleApplyAiSessions}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all mt-2"
                    >
                      Import All {aiSuggestedList.length} Sessions to My Planner
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Add Session Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Study Session</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualSession} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithms Midterm Practice"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="review">Review</option>
                    <option value="exam_prep">Exam Prep</option>
                    <option value="deep_work">Deep Work</option>
                    <option value="group">Group Study</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
