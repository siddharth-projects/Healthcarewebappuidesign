import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { LayoutDashboard, Users, Calendar } from 'lucide-react';
import { patientApi } from '../../../services/api';

const sidebarItems = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Browse Doctors', path: '/patient/doctors', icon: Users },
  { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
];

interface Appointment {
  id: number;
  doctorName: string;
  doctorQualification: string;
  hospital: string;
  appointmentTime: string;
  status: string;
}

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await patientApi.getAppointments();
        setAppointments(data);
      } catch (error) {
        setAppointments([
          {
            id: 1,
            doctorName: 'Dr. Emily Carter',
            doctorQualification: 'MBBS, MD (Cardiology)',
            hospital: 'City General Hospital',
            appointmentTime: '2026-04-20T10:00:00',
            status: 'PENDING'
          },
          {
            id: 2,
            doctorName: 'Dr. James Wilson',
            doctorQualification: 'MBBS, MS (Orthopedics)',
            hospital: 'Medicare Center',
            appointmentTime: '2026-04-22T14:00:00',
            status: 'APPROVED'
          },
          {
            id: 3,
            doctorName: 'Dr. Sarah Brown',
            doctorQualification: 'MBBS, MD (Pediatrics)',
            hospital: 'Children\'s Hospital',
            appointmentTime: '2026-04-18T11:00:00',
            status: 'COMPLETED'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-1">Track your scheduled and past appointments</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">No Appointments</p>
              <p className="text-gray-500">You haven't booked any appointments yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{apt.doctorName}</h3>
                      <Badge variant={
                        apt.status === 'COMPLETED' ? 'success' :
                        apt.status === 'APPROVED' ? 'info' :
                        apt.status === 'REJECTED' ? 'danger' : 'warning'
                      }>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{apt.doctorQualification}</p>
                    <p className="text-sm text-gray-600 mb-2">{apt.hospital}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(apt.appointmentTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </DashboardLayout>
  );
};
