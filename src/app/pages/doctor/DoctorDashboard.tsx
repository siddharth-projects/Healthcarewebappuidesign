import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { LayoutDashboard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { doctorApi } from '../../../services/api';
import { toast } from 'sonner';

const sidebarItems = [
  { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
];

interface Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  appointmentTime: string;
  status: string;
  medicalHistory?: string;
}

export const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchAppointments = async () => {
    try {
      const data = await doctorApi.getAppointments();
      setAppointments(data);
    } catch (error) {
      setAppointments([
        {
          id: 1,
          patientName: 'John Doe',
          patientEmail: 'john@example.com',
          appointmentTime: '2026-04-20T10:00:00',
          status: 'PENDING',
          medicalHistory: 'Diabetes, Hypertension'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          patientEmail: 'jane@example.com',
          appointmentTime: '2026-04-20T14:00:00',
          status: 'APPROVED'
        },
        {
          id: 3,
          patientName: 'Bob Johnson',
          patientEmail: 'bob@example.com',
          appointmentTime: '2026-04-19T11:00:00',
          status: 'COMPLETED'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId: number, status: string) => {
    try {
      await doctorApi.updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status.toLowerCase()} successfully!`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment status.');
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    filter === 'all' || apt.status === filter
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    approved: appointments.filter(a => a.status === 'APPROVED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your appointments and patient consultations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
            <div className="flex gap-2">
              <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>
                All
              </Button>
              <Button size="sm" variant={filter === 'PENDING' ? 'primary' : 'secondary'} onClick={() => setFilter('PENDING')}>
                Pending
              </Button>
              <Button size="sm" variant={filter === 'APPROVED' ? 'primary' : 'secondary'} onClick={() => setFilter('APPROVED')}>
                Approved
              </Button>
              <Button size="sm" variant={filter === 'COMPLETED' ? 'primary' : 'secondary'} onClick={() => setFilter('COMPLETED')}>
                Completed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">No Appointments</p>
              <p className="text-gray-500">You don't have any {filter !== 'all' ? filter.toLowerCase() : ''} appointments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Medical History</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{apt.patientName}</p>
                        <p className="text-sm text-gray-600">{apt.patientEmail}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {new Date(apt.appointmentTime).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {apt.medicalHistory || 'None'}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={
                          apt.status === 'COMPLETED' ? 'success' :
                          apt.status === 'APPROVED' ? 'info' :
                          apt.status === 'REJECTED' ? 'danger' : 'warning'
                        }>
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          {apt.status === 'PENDING' && (
                            <>
                              <Button size="sm" variant="success" onClick={() => handleStatusUpdate(apt.id, 'APPROVED')}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(apt.id, 'REJECTED')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {apt.status === 'APPROVED' && (
                            <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}>
                              <Clock className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};
