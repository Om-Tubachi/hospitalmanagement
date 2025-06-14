'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, User, Stethoscope } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  initials: string;
  availability: string[];
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    department: 'Heart Center',
    initials: 'SJ',
    availability: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Orthopedics',
    department: 'Bone & Joint',
    initials: 'MC',
    availability: ['08:30 AM', '11:00 AM', '01:30 PM', '03:00 PM']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatology',
    department: 'Skin Care',
    initials: 'ER',
    availability: ['09:30 AM', '11:30 AM', '02:30 PM', '04:00 PM']
  }
];

export function AppointmentBooking() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  const selectedDoctorData = mockDoctors.find(d => d.id === selectedDoctor);

  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    console.log('Booking appointment:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      notes
    });
    
    // Reset form or show success message
    alert('Appointment booked successfully!');
    setStep(1);
    setSelectedDoctor('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setAppointmentType('');
    setNotes('');
  };

  const canProceedToStep2 = selectedDoctor && appointmentType;
  const canProceedToStep3 = canProceedToStep2 && selectedDate;
  const canBookAppointment = canProceedToStep3 && selectedTime;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {[
          { step: 1, title: 'Select Doctor & Type', icon: User },
          { step: 2, title: 'Choose Date', icon: CalendarIcon },
          { step: 3, title: 'Select Time', icon: Clock }
        ].map(({ step: stepNum, title, icon: Icon }) => (
          <div key={stepNum} className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className={`text-sm font-medium ${
              step >= stepNum ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor & Appointment Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Doctor & Appointment Type</CardTitle>
            <CardDescription>Choose your preferred doctor and the type of consultation you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Doctor</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {doctor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <p className="text-xs text-gray-500">{doctor.department}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Appointment Type</label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                  <SelectItem value="check-up">Regular Check-up</SelectItem>
                  <SelectItem value="emergency">Emergency Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={() => setStep(2)} 
              disabled={!canProceedToStep2}
              className="w-full"
            >
              Continue to Date Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Date */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>
              Choose your preferred appointment date with {selectedDoctorData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!canProceedToStep3}
                className="flex-1"
              >
                Continue to Time Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Time & Notes */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Time & Add Notes</CardTitle>
            <CardDescription>
              Choose an available time slot and add any additional notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Available Time Slots</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedDoctorData?.availability.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="justify-center"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms or reason for visit..."
                rows={3}
              />
            </div>

            {/* Appointment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Appointment Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Doctor:</strong> {selectedDoctorData?.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctorData?.specialization}</p>
                <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Type:</strong> {appointmentType}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleBookAppointment}
                disabled={!canBookAppointment}
                className="flex-1"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}