import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { LucideIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: { name: string; path: string; icon: LucideIcon }[];
}

export const DashboardLayout = ({ children, sidebarItems }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      <Navbar />
      <main className="ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
