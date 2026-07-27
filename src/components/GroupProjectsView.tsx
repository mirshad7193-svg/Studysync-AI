import React, { useState } from 'react';
import { GroupProject, ProjectTask, ProjectDoc, ChatMessage, Member } from '../types';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  Plus, 
  Sparkles, 
  Send, 
  Calendar, 
  UserCheck, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  Share2,
  Briefcase
} from 'lucide-react';

interface GroupProjectsViewProps {
  projects: GroupProject[];
  onUpdateProject: (project: GroupProject) => void;
  onAddProject: (project: Omit<GroupProject, 'id'>) => void;
}

export const GroupProjectsView: React.FC<GroupProjectsViewProps> = ({
  projects,
  onUpdateProject,
  onAddProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'tasks' | 'docs' | 'chat'>('tasks');

  // Active project
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Task creation state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedMemberId, setAssignedMemberId] = useState<string>('');

  // Doc creation/edit state
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Project Modal
  const [isAddProjModalOpen, setIsAddProjModalOpen] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCourse, setNewProjCourse] = useState('CS 350 - Software Engineering');
  const [newProjDesc, setNewProjDesc] = useState('');

  if (!project) {
    return <div className="p-8 text-center text-slate-500">No group projects found.</div>;
  }

  // Active doc
  const currentDoc = project.documents.find((d) => d.id === activeDocId) || project.documents[0];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `pt-${Date.now()}`,
      title: taskTitle.trim(),
      assignedToId: assignedMemberId || project.members[0].id,
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      priority: 'medium',
    };

    onUpdateProject({
      ...project,
      tasks: [...project.tasks, newTask],
    });

    setTaskTitle('');
    setIsAddTaskModalOpen(false);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updatedTasks = project.tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus: ProjectTask['status'] =
          t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'todo';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'You (Alex Chen)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      message: chatInput.trim(),
      timestamp: 'Just now',
    };

    onUpdateProject({
      ...project,
      discussion: [...project.discussion, newMsg],
    });

    setChatInput('');
  };

  const handleSaveDoc = () => {
    if (!currentDoc) return;
    const updatedDocs = project.documents.map((d) =>
      d.id === currentDoc.id
        ? { ...d, title: docTitle || d.title, content: docContent, lastUpdated: 'Just now', updatedBy: 'You' }
        : d
    );
    onUpdateProject({ ...project, documents: updatedDocs });
    setIsEditingDoc(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    onAddProject({
      title: newProjTitle.trim(),
      course: newProjCourse,
      description: newProjDesc || 'Collaborative group workspace',
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      members: [
        { id: 'm-1', name: 'You (Alex Chen)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Leader', email: 'alex.chen@university.edu' },
      ],
      tasks: [],
      documents: [
        { id: `doc-${Date.now()}`, title: 'Project Charter & Overview', content: '# Welcome to your new project workspace!', lastUpdated: 'Just now', updatedBy: 'You' }
      ],
      discussion: [
        { id: `msg-${Date.now()}`, senderName: 'StudyPulse Bot', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', message: 'Workspace created! Invite team members or assign tasks.', timestamp: 'Just now', isAi: true }
      ]
    });

    setNewProjTitle('');
    setNewProjDesc('');
    setIsAddProjModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Workspace Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Group Project Workspaces</h1>
          <p className="text-xs text-slate-500">Collaborate on shared tasks, documents, and team discussions.</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Select Project Dropdown */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.course} - {p.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAddProjModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Group Project</span>
          </button>
        </div>
      </div>

      {/* Project Banner & Member Roster */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                {project.course}
              </span>
              <span className="text-xs text-slate-500 font-medium">Due {project.dueDate}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">{project.title}</h2>
            <p className="text-xs text-slate-600">{project.description}</p>
          </div>

          {/* Members Avatars & Roles */}
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-xs font-bold text-slate-700 shrink-0">Team ({project.members.length}):</span>
            <div className="flex -space-x-2 overflow-hidden">
              {project.members.map((member) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  title={`${member.name} - ${member.role}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Inner Tabs Navigation */}
        <div className="flex items-center space-x-2 border-t pt-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Shared Tasks ({project.tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Group Docs ({project.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Team Chat ({project.discussion.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Shared Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Task Allocation & Progress</h3>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['todo', 'in_progress', 'completed'] as const).map((statusKey) => {
              const items = project.tasks.filter((t) => t.status === statusKey);
              const headers = {
                todo: { label: 'To Do', color: 'bg-slate-200 text-slate-800' },
                in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
                completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
              };

              return (
                <div key={statusKey} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 min-h-[250px]">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${headers[statusKey].color}`}>
                      {headers[statusKey].label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{items.length}</span>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((task) => {
                      const assignee = project.members.find((m) => m.id === task.assignedToId) || project.members[0];

                      return (
                        <div key={task.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <h4 className="font-bold text-slate-900 text-xs">{task.title}</h4>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <div className="flex items-center space-x-1.5">
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-4 h-4 rounded-full"
                              />
                              <span className="font-semibold text-slate-700">{assignee.name.split(' ')[0]}</span>
                            </div>

                            <button
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-bold"
                            >
                              Status →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Group Docs */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Docs list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Documents</h3>
            </div>

            {project.documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setActiveDocId(doc.id);
                  setDocTitle(doc.title);
                  setDocContent(doc.content);
                  setIsEditingDoc(false);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  (currentDoc?.id === doc.id)
                    ? 'bg-indigo-50 border-indigo-300 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Updated {doc.lastUpdated} by {doc.updatedBy}</p>
              </div>
            ))}
          </div>

          {/* Right: Doc Editor/Viewer */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {currentDoc ? (
              <>
                <div className="flex items-center justify-between border-b pb-3">
                  {isEditingDoc ? (
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="font-bold text-base text-slate-900 border-b border-indigo-500 focus:outline-none w-full"
                    />
                  ) : (
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{currentDoc.title}</h3>
                      <p className="text-[11px] text-slate-400">Last edited: {currentDoc.lastUpdated}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {isEditingDoc ? (
                      <button
                        onClick={handleSaveDoc}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setDocTitle(currentDoc.title);
                          setDocContent(currentDoc.content);
                          setIsEditingDoc(true);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Doc</span>
                      </button>
                    )}
                  </div>
                </div>

                {isEditingDoc ? (
                  <textarea
                    rows={12}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                ) : (
                  <div className="prose prose-xs text-slate-800 whitespace-pre-wrap font-sans text-xs leading-relaxed min-h-[200px]">
                    {currentDoc.content}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-500">Select a document from the left list.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Team Discussion / Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Project Chat Room</span>
            </h3>
            <span className="text-xs text-slate-500">Visible to all team members</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {project.discussion.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full shrink-0 object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex items-center space-x-2 pt-2 border-t">
            <input
              type="text"
              placeholder="Type a message to your project group..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Assign Project Task</h3>
              <button onClick={() => setIsAddTaskModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct user surveys for Section 2"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign To Member</label>
                <select
                  value={assignedMemberId}
                  onChange={(e) => setAssignedMemberId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {project.members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isAddProjModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Group Project</h3>
              <button onClick={() => setIsAddProjModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Robotics Case Study"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={newProjCourse}
                  onChange={(e) => setNewProjCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddProjModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
