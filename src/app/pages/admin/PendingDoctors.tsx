import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { LayoutDashboard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { toast } from 'sonner';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Pending Doctors', path: '/admin/pending-doctors', icon: Clock },
];

interface Doctor {
  id: number;
  name: string;
  email: string;
  qualification: string;
  hospital: string;
  experienceYears: number;
  availabilitySlots: string;
  status: string;
}

export const PendingDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const data = await adminApi.getPendingDoctors();
      setDoctors(data);
    } catch (error) {
      setDoctors([
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.j@example.com',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'City General Hospital',
          experienceYears: 8,
          availabilitySlots: 'Mon-Fri 9AM-5PM',
          status: 'PENDING'
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          email: 'michael.c@example.com',
          qualification: 'MBBS, MS (Orthopedics)',
          hospital: 'Medicare Center',
          experienceYears: 6,
          availabilitySlots: 'Mon-Sat 10AM-6PM',
          status: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleVerify = async (doctorId: number, approve: boolean) => {
    try {
      await adminApi.verifyDoctor(doctorId, approve);
      toast.success(approve ? 'Doctor approved successfully!' : 'Doctor rejected.');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to update doctor status.');
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Doctor Verifications</h1>
        <p className="text-gray-600 mt-1">Review and approve doctor registrations</p>
      </div>

      {loading ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          </CardBody>
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">No Pending Verifications</p>
              <p className="text-gray-500">All doctor applications have been processed.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <Badge variant="warning">{doctor.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Qualification</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.qualification}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.hospital}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.experienceYears} years</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Availability</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.availabilitySlots}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleVerify(doctor.id, true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleVerify(doctor.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
