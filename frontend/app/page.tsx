'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Calendar, Shield, Stethoscope, Activity } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Redirecting to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MEDORA</h1>
                <p className="text-sm text-gray-500">Healthcare ERM</p>
              </div>
            </div>
            <Button onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Advanced Healthcare
            <span className="text-blue-600"> ERM System</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your healthcare operations with our comprehensive Electronic Records Management system. 
            Designed for doctors, nurses, patients, and administrators.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button onClick={() => router.push('/login')} size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Secure, role-based access control for Super Admins, Doctors, Nurses, and Patients
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  Comprehensive patient records, medical history, and care coordination
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Appointment System</CardTitle>
                <CardDescription>
                  Intelligent appointment scheduling with real-time availability
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>
                  Digital medical records with prescription management and history tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Live notifications, task management, and vital signs tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Patient Care</CardTitle>
                <CardDescription>
                  Holistic patient care coordination with nursing task management
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to transform your healthcare workflow?</h2>
          <p className="mt-4 text-blue-100 text-lg">
            Join thousands of healthcare professionals using MEDORA ERM system.
          </p>
          <Button 
            onClick={() => router.push('/login')} 
            size="lg" 
            variant="secondary" 
            className="mt-6"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}