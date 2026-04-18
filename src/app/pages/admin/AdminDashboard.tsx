import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { LayoutDashboard, Users, UserCheck, Clock } from 'lucide-react';
import { adminApi } from '../../../services/api';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Pending Doctors', path: '/admin/pending-doctors', icon: Clock },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    pendingApprovals: 0,
    totalPatients: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pending = await adminApi.getPendingDoctors();
        setStats({
          totalDoctors: 12,
          pendingApprovals: pending.length || 0,
          totalPatients: 45
        });
      } catch (error) {
        setStats({
          totalDoctors: 12,
          pendingApprovals: 3,
          totalPatients: 45
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage doctors and monitor platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <ActivityItem
              title="New doctor registration"
              description="Dr. Sarah Johnson registered"
              time="2 hours ago"
            />
            <ActivityItem
              title="Doctor verified"
              description="Dr. Michael Chen was approved"
              time="5 hours ago"
            />
            <ActivityItem
              title="New patient registered"
              description="John Doe joined the platform"
              time="1 day ago"
            />
          </div>
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};

const ActivityItem = ({ title, description, time }: { title: string; description: string; time: string }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
    <div className="flex-1">
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);
