'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Calendar, FileText } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    department?: string;
    specialization?: string;
    license?: string;
    emergency_contact?: any;
  };
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

interface Patient {
  id: string;
  // user_id: string;
  patient_id: string;
  assigned_doctor?: string;
  assigned_nurses?: string[];
  medical_history?: any[];
  vitals?: any[];
  created_at: string;
  user_id: User;
}

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

const fetchPatients = async () => {
  try {
    const token = localStorage.getItem('medora_token');
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await fetch('/api/patients', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Handle the nested structure from MongoDB function
      const patientsData = result.data?.patients || result.patients || [];
      setPatients(patientsData);
    } else {
      console.error('Failed to fetch patients:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
  } finally {
    setLoading(false);
  }
};

  const getInitials = (user: User | string) => {
  // Handle case where user_id might be just a string
  if (typeof user === 'string') {
    return user[0]?.toUpperCase() || 'U';
  }
  
  if (user?.profile?.first_name && user?.profile?.last_name) {
    return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
  }
  return user?.email?.[0]?.toUpperCase() || 'U';
};


const filteredPatients = patients.filter(patient => {
  if (!patient) return false;
  
  const userEmail = typeof patient.user_id === 'string' ? '' : (patient.user_id?.email || '');
  const firstName = typeof patient.user_id === 'string' ? '' : (patient.user_id?.profile?.first_name || '');
  const lastName = typeof patient.user_id === 'string' ? '' : (patient.user_id?.profile?.last_name || '');
  const patientId = patient.patient_id || '';
  
  const searchLower = searchTerm.toLowerCase();
  
  return (
    userEmail.toLowerCase().includes(searchLower) ||
    `${firstName} ${lastName}`.toLowerCase().includes(searchLower) ||
    patientId.toLowerCase().includes(searchLower)
  );
});

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Records</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Manage your assigned patients</CardDescription>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {getInitials(patient.user_id)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {patient.user_id.profile?.first_name && patient.user_id.profile?.last_name
                        ? `${patient.user_id.profile.first_name} ${patient.user_id.profile.last_name}`
                        : patient.user_id.email}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
                    <p className="text-sm text-gray-500">{patient.user_id.email}</p>
                    {patient.user_id.profile?.phone && (
                      <p className="text-sm text-gray-500">{patient.user_id.profile.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'No patients match your search criteria.' : 'You have no assigned patients yet.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}