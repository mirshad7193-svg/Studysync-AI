import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  FileText, 
  Sparkles, 
  Timer,
  GraduationCap
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'assignments' | 'planner' | 'groups' | 'summarizer';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenFocusTimer: () => void;
  onOpenAiChat: () => void;
  pendingAssignmentCount: number;
  activeFocusMinutes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenFocusTimer,
  onOpenAiChat,
  pendingAssignmentCount,
  activeFocusMinutes,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'assignments' as ActiveTab, 
      label: 'Assignments', 
      icon: CheckSquare,
      badge: pendingAssignmentCount > 0 ? pendingAssignmentCount : undefined
    },
    { id: 'planner' as ActiveTab, label: 'Study Planner', icon: Calendar },
    { id: 'groups' as ActiveTab, label: 'Group Projects', icon: Users },
    { id: 'summarizer' as ActiveTab, label: 'AI Note Summarizer', icon: FileText, isAi: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">StudyPulse</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  AI Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Track • Plan • Collaborate</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                  {item.isAi && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Focus Timer Button */}
            <button
              onClick={onOpenFocusTimer}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Open Focus Pomodoro Timer"
            >
              <Timer className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Focus Timer</span>
              {activeFocusMinutes > 0 && (
                <span className="font-semibold text-indigo-600">({activeFocusMinutes}m)</span>
              )}
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiChat}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-200 animate-spin-slow" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium rounded-md whitespace-nowrap ${
                  isActive ? 'text-indigo-600 bg-indigo-50/80 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
