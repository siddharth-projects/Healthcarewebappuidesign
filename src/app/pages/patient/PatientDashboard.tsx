import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Card, CardHeader, CardBody } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LayoutDashboard, Users, Calendar, Stethoscope, MapPin, Award } from 'lucide-react';
import { patientApi } from '../../../services/api';
import { toast } from 'sonner';

const sidebarItems = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
  { name: 'Browse Doctors', path: '/patient/doctors', icon: Users },
  { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
];

interface Doctor {
  id: number;
  name: string;
  qualification: string;
  hospital: string;
  experienceYears: number;
  availabilitySlots: string;
}

export const PatientDashboard = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentTime, setAppointmentTime] = useState('');

  const fetchDoctors = async () => {
    try {
      const data = await patientApi.getDoctors();
      setDoctors(data);
    } catch (error) {
      setDoctors([
        {
          id: 1,
          name: 'Dr. Emily Carter',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'City General Hospital',
          experienceYears: 12,
          availabilitySlots: 'Mon-Fri 9AM-5PM'
        },
        {
          id: 2,
          name: 'Dr. James Wilson',
          qualification: 'MBBS, MS (Orthopedics)',
          hospital: 'Medicare Center',
          experienceYears: 10,
          availabilitySlots: 'Mon-Sat 10AM-6PM'
        },
        {
          id: 3,
          name: 'Dr. Sarah Brown',
          qualification: 'MBBS, MD (Pediatrics)',
          hospital: 'Children\'s Hospital',
          experienceYears: 8,
          availabilitySlots: 'Tue-Sat 8AM-4PM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    if (!selectedDoctor || !appointmentTime) {
      toast.error('Please select a date and time.');
      return;
    }

    try {
      await patientApi.bookAppointment(selectedDoctor.id, appointmentTime);
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      setAppointmentTime('');
      setSelectedDoctor(null);
    } catch (error) {
      toast.error('Failed to book appointment.');
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find Your Doctor</h1>
        <p className="text-gray-600 mt-1">Browse verified doctors and book appointments</p>
      </div>

      {loading ? (
        <Card>
          <CardBody>
            <p className="text-center py-8 text-gray-500">Loading doctors...</p>
          </CardBody>
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">No Doctors Available</p>
              <p className="text-gray-500">Please check back later.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    {doctor.qualification}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {doctor.hospital}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {doctor.experienceYears} years experience
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 mb-1">Available</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.availabilitySlots}</p>
                </div>
                <Button className="w-full" onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Appointment"
      >
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.qualification}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
            </div>
            <Input
              label="Appointment Date & Time"
              type="datetime-local"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <Button onClick={submitBooking} className="flex-1">
                Confirm Booking
              </Button>
              <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
