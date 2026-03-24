import React from 'react';
import { LayoutDashboard, UserCheck, ClipboardList, ExternalLink } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'management', label: '상벌점 관리', icon: UserCheck },
    { id: 'log', label: '상벌점 로그', icon: ClipboardList },
  ];

  return (
    <div className="hidden md:flex w-64 bg-white text-zinc-900 h-screen flex-col border-r border-zinc-200 shadow-sm">
      <div className="p-6 border-b border-zinc-100">
        <h1 className="text-xl font-bold tracking-tight text-emerald-600">생활평점제 시스템</h1>
        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-semibold">Management v1.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm" 
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600")} />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <a
          href="https://docs.google.com/spreadsheets/d/1eJgV9dB_g-Onxr8f8ROA8eaJgiisN5WwNar7aMLEh8M/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all group"
        >
          <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600" />
          <span className="font-medium">스프레드시트 열기</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
