# MEDORA Healthcare Management System

A comprehensive multi-role healthcare management dashboard with secure authentication and role-based access control.

## Features

- **Multi-Role Authentication**: Super Admin, Doctor, Nurse, Patient roles
- **Role-Based Dashboards**: Customized interfaces for each user type
- **Appointment Management**: Booking, scheduling, and calendar integration
- **Medical Records**: Secure patient data management
- **Notification System**: Real-time alerts and notifications
- **Responsive Design**: Optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with role-based middleware
- **Real-time**: Socket.io for notifications

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in backend folder
   - Copy `.env.local.example` to `.env.local` in frontend folder

3. Start development servers:
```bash
npm run dev
```

## Project Structure

```
MEDORA-PROJECT/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── package.json       # Root workspace configuration
```

## Role Permissions

### Super Admin
- Manage all users and roles
- View system-wide reports
- Assign doctor-patient relationships

### Doctor
- View assigned patients
- Manage medical records
- Handle appointment requests

### Nurse
- Access assigned patient tasks
- Input vitals and measurements
- Assist with daily care coordination

### Patient
- View personal medical records
- Book and manage appointments
- Download medical reports