import React, { useState } from 'react';
import { Assignment, Priority, AssignmentStatus } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  List, 
  Kanban, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Calendar,
  AlertCircle,
  Tag,
  Loader2
} from 'lucide-react';

interface AssignmentsViewProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleAssignment: (id: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onToggleAssignment,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS 301 - Computer Science');
  const [newDueDate, setNewDueDate] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [newDueTime, setNewDueTime] = useState('23:59');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newEstHours, setNewEstHours] = useState(3);
  const [newNotes, setNewNotes] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('Homework, Study');

  // AI Breakdown state
  const [breakingDownId, setBreakingDownId] = useState<string | null>(null);

  // Extract unique courses for filtering
  const courses = Array.from(new Set(assignments.map((a) => a.course)));

  // Filter assignments
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.notes && a.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = selectedCourse === 'all' || a.course === selectedCourse;
    const matchesPriority = selectedPriority === 'all' || a.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesPriority && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddAssignment({
      title: newTitle.trim(),
      course: newCourse,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      status: 'todo',
      estimatedHours: Number(newEstHours),
      notes: newNotes,
      subtasks: [],
      tags: newTagsStr.split(',').map((t) => t.trim()).filter(Boolean),
    });

    // Reset Form
    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // AI Task Breakdown Action
  const handleAiBreakdown = async (assignment: Assignment) => {
    try {
      setBreakingDownId(assignment.id);
      const response = await fetch('/api/ai/breakdown-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: assignment.title,
          course: assignment.course,
          notes: assignment.notes,
          estimatedHours: assignment.estimatedHours,
        }),
      });

      const data = await response.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        const newSubtasks = data.subtasks.map((st: { title: string }, idx: number) => ({
          id: `sub-${Date.now()}-${idx}`,
          title: st.title,
          completed: false,
        }));

        onUpdateAssignment({
          ...assignment,
          subtasks: [...(assignment.subtasks || []), ...newSubtasks],
        });
      }
    } catch (err) {
      console.error('Failed to break down subtasks, using fallback:', err);
      const fallbackSubtasks = [
        { id: `sub-fb-1-${Date.now()}`, title: `Review guidelines & outline approach for ${assignment.title}`, completed: false },
        { id: `sub-fb-2-${Date.now()}`, title: `Draft core sections / write code implementation`, completed: false },
        { id: `sub-fb-3-${Date.now()}`, title: `Verify edge cases and complete final review for ${assignment.course}`, completed: false },
      ];
      onUpdateAssignment({
        ...assignment,
        subtasks: [...(assignment.subtasks || []), ...fallbackSubtasks],
      });
    } finally {
      setBreakingDownId(null);
    }
  };

  const toggleSubtask = (assignment: Assignment, subtaskId: string) => {
    if (!assignment.subtasks) return;
    const updatedSubtasks = assignment.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateAssignment({ ...assignment, subtasks: updatedSubtasks });
  };

  return (
    <div className="space-y-6">
      {/* View Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignment Tracker</h1>
          <p className="text-xs text-slate-500">Organize coursework, due dates, subtasks, and priorities.</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main List Mode */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No assignments found</p>
              <p className="text-xs text-slate-500">Try adjusting your filters or create a new assignment.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const subtasks = assignment.subtasks || [];
              const completedSubtasks = subtasks.filter((s) => s.completed).length;
              const isBreaking = breakingDownId === assignment.id;

              return (
                <div
                  key={assignment.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => onToggleAssignment(assignment.id)}
                        className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          assignment.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-indigo-500 bg-slate-50'
                        }`}
                      >
                        {assignment.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                            {assignment.course}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              assignment.priority === 'high'
                                ? 'bg-rose-100 text-rose-700'
                                : assignment.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {assignment.priority}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              assignment.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : assignment.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {assignment.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <h3 className={`text-base font-bold text-slate-900 mt-1.5 ${
                          assignment.status === 'completed' ? 'line-through text-slate-400' : ''
                        }`}>
                          {assignment.title}
                        </h3>

                        {assignment.notes && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{assignment.notes}</p>
                        )}

                        {/* Tags */}
                        {assignment.tags && assignment.tags.length > 0 && (
                          <div className="flex items-center space-x-1.5 mt-2">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {assignment.tags.map((t) => (
                              <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.2 rounded font-medium">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Due Date */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                      <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Due {assignment.dueDate} {assignment.dueTime ? `@ ${assignment.dueTime}` : ''}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* AI Breakdown button */}
                        <button
                          onClick={() => handleAiBreakdown(assignment)}
                          disabled={isBreaking}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors disabled:opacity-50"
                          title="Generate subtasks automatically with AI"
                        >
                          {isBreaking ? (
                            <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{isBreaking ? 'Generating...' : 'AI Subtasks'}</span>
                        </button>

                        <button
                          onClick={() => onDeleteAssignment(assignment.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtasks Section */}
                  {subtasks.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Subtasks ({completedSubtasks}/{subtasks.length})</span>
                        <span>{Math.round((completedSubtasks / subtasks.length) * 100)}%</span>
                      </div>

                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-300"
                          style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtask(assignment, st.id)}
                            className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-medium text-slate-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => {}}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className={st.completed ? 'line-through text-slate-400' : ''}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Kanban Board Mode */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'completed'] as AssignmentStatus[]).map((statusKey) => {
            const items = filteredAssignments.filter((a) => a.status === statusKey);
            const statusLabels = {
              todo: { label: 'To Do', color: 'bg-slate-200 text-slate-800' },
              in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
              completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
            };

            return (
              <div key={statusKey} className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${statusLabels[statusKey].color}`}>
                    {statusLabels[statusKey].label}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{items.length}</span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {item.course}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{item.notes}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span>Due {item.dueDate}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              const nextStatus: AssignmentStatus =
                                statusKey === 'todo' ? 'in_progress' : statusKey === 'in_progress' ? 'completed' : 'todo';
                              onUpdateAssignment({ ...item, status: nextStatus });
                            }}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold"
                          >
                            Move →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add New Assignment</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry Synthesis Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject</label>
                  <input
                    type="text"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newEstHours}
                    onChange={(e) => setNewEstHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Guidelines</label>
                <textarea
                  rows={2}
                  placeholder="Additional details, rubric notes, or formatting rules..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
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
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
