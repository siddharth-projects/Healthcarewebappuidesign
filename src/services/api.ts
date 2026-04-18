const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  registerDoctor: async (data: {
    email: string;
    password: string;
    name: string;
    qualification: string;
    hospital: string;
    experienceYears: number;
    availabilitySlots: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  registerPatient: async (data: {
    email: string;
    password: string;
    name: string;
    age: number;
    gender: string;
    medicalHistory: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }
};

export const adminApi = {
  getPendingDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/pending`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch pending doctors');
    return response.json();
  },

  verifyDoctor: async (doctorId: number, approve: boolean) => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${doctorId}/verify?approve=${approve}`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to verify doctor');
    return response.json();
  }
};

export const patientApi = {
  getDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/patient/doctors`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
  },

  bookAppointment: async (doctorId: number, appointmentTime: string) => {
    const response = await fetch(`${API_BASE_URL}/patient/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ doctorId, appointmentTime })
    });
    if (!response.ok) throw new Error('Failed to book appointment');
    return response.json();
  },

  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/patient/appointments`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  }
};

export const doctorApi = {
  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/doctor/appointments`, {
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  },

  updateAppointmentStatus: async (appointmentId: number, newStatus: string) => {
    const response = await fetch(`${API_BASE_URL}/doctor/appointments/${appointmentId}/status?newStatus=${newStatus}`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  }
};
