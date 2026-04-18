import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, Activity } from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">DocDash</span>
        </div>
      </div>
      <nav className="px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
