import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: 'Sarah Johnson',
        age: 34,
        gender: 'Female',
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@email.com',
        lastVisit: '2024-06-10',
        condition: 'Hypertension',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Michael Chen',
        age: 45,
        gender: 'Male',
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@email.com',
        lastVisit: '2024-06-08',
        condition: 'Diabetes Type 2',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        age: 28,
        gender: 'Female',
        phone: '+1 (555) 345-6789',
        email: 'emily.rodriguez@email.com',
        lastVisit: '2024-06-05',
        condition: 'Asthma',
        status: 'Inactive'
      }
    ];
    
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    // Add patient logic
    console.log('Add new patient');
  };

  const handleViewPatient = (patientId) => {
    console.log('View patient:', patientId);
  };

  const handleEditPatient = (patientId) => {
    console.log('Edit patient:', patientId);
  };

  const handleDeletePatient = (patientId) => {
    console.log('Delete patient:', patientId);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600">Manage your assigned patients</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Patient Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Age/Gender</th>
                  <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-900">Last Visit</th>
                  <th className="text-left p-4 font-medium text-gray-900">Condition</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {patient.age} years, {patient.gender}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {patient.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPatient(patient.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPatients.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                No patients found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPatients;