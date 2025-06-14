'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClipboardList, Clock, AlertCircle, CheckCircle2, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  patient: {
    name: string;
    room: string;
    initials: string;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueTime: string;
  type: 'medication' | 'vitals' | 'assessment' | 'care';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Administer Morning Medication',
    description: 'Give prescribed morning medications to patient',
    patient: { name: 'Sarah Johnson', room: '201A', initials: 'SJ' },
    priority: 'high',
    status: 'pending',
    dueTime: '09:00 AM',
    type: 'medication'
  },
  {
    id: '2',
    title: 'Check Vital Signs',
    description: 'Record blood pressure, temperature, and heart rate',
    patient: { name: 'Mike Chen', room: '203B', initials: 'MC' },
    priority: 'medium',
    status: 'in-progress',
    dueTime: '10:30 AM',
    type: 'vitals'
  },
  {
    id: '3',
    title: 'Wound Dressing Change',
    description: 'Change surgical wound dressing and assess healing',
    patient: { name: 'Emily Davis', room: '205A', initials: 'ED' },
    priority: 'high',
    status: 'pending',
    dueTime: '11:00 AM',
    type: 'care'
  },
  {
    id: '4',
    title: 'Patient Assessment',
    description: 'Complete daily patient assessment form',
    patient: { name: 'Robert Wilson', room: '202B', initials: 'RW' },
    priority: 'medium',
    status: 'completed',
    dueTime: '08:00 AM',
    type: 'assessment'
  },
  {
    id: '5',
    title: 'Physical Therapy Assistance',
    description: 'Assist patient with prescribed physical therapy exercises',
    patient: { name: 'Lisa Anderson', room: '204A', initials: 'LA' },
    priority: 'low',
    status: 'pending',
    dueTime: '02:00 PM',
    type: 'care'
  }
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'vitals': return '📊';
      case 'assessment': return '📋';
      case 'care': return '🩺';
      default: return '📝';
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed'
          }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daily Tasks</CardTitle>
              <CardDescription>Manage your nursing tasks and patient care activities</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setFilter('all')} className={filter === 'all' ? 'bg-blue-50' : ''}>
                All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilter('pending')} className={filter === 'pending' ? 'bg-orange-50' : ''}>
                Pending
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilter('in-progress')} className={filter === 'in-progress' ? 'bg-blue-50' : ''}>
                In Progress
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilter('completed')} className={filter === 'completed' ? 'bg-green-50' : ''}>
                Completed
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-colors ${
                  task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(task.type)}</span>
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm mb-3 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                            {task.patient.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.patient.name}</p>
                          <p className="text-xs text-gray-500">Room {task.patient.room}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'You have no tasks assigned yet.' : `No ${filter.replace('-', ' ')} tasks.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}