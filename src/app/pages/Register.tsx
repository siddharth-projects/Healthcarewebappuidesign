import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

export const Register = () => {
  const [userType, setUserType] = useState<'DOCTOR' | 'PATIENT'>('PATIENT');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join DocDash healthcare platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('PATIENT')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'PATIENT'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">Patient</p>
                <p className="text-sm text-gray-600">Book appointments</p>
              </button>
              <button
                type="button"
                onClick={() => setUserType('DOCTOR')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'DOCTOR'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">Doctor</p>
                <p className="text-sm text-gray-600">Manage appointments</p>
              </button>
            </div>
          </div>

          {userType === 'DOCTOR' ? <DoctorForm /> : <PatientForm />}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    hospital: '',
    experienceYears: '',
    availabilitySlots: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.registerDoctor({
        ...formData,
        experienceYears: parseInt(formData.experienceYears)
      });
      toast.success('Registration successful! Please wait for admin approval.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Dr. John Smith"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="doctor@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Input
        label="Qualification"
        placeholder="MBBS, MD"
        value={formData.qualification}
        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
        required
      />
      <Input
        label="Hospital"
        placeholder="City Hospital"
        value={formData.hospital}
        onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
        required
      />
      <Input
        label="Years of Experience"
        type="number"
        placeholder="5"
        value={formData.experienceYears}
        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
        required
      />
      <Input
        label="Availability Slots"
        placeholder="Mon-Fri 9AM-5PM"
        value={formData.availabilitySlots}
        onChange={(e) => setFormData({ ...formData, availabilitySlots: e.target.value })}
        required
      />
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Registering...' : 'Register as Doctor'}
      </Button>
    </form>
  );
};

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.registerPatient({
        ...formData,
        age: parseInt(formData.age)
      });
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="patient@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="25"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' }
          ]}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Medical History
        </label>
        <textarea
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Any medical conditions or allergies..."
          value={formData.medicalHistory}
          onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Registering...' : 'Register as Patient'}
      </Button>
    </form>
  );
};
