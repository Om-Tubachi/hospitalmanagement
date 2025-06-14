'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Settings, 
  BarChart3,
  ClipboardList,
  Stethoscope,
  UserCheck,
  Shield,
  Heart,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  description?: string;
}

const navigation: NavigationItem[] = [
  // Super Admin Routes
  { 
    name: 'System Overview', 
    href: '/dashboard', 
    icon: BarChart3, 
    roles: ['super_admin'],
    description: 'View system statistics and overview'
  },
  { 
    name: 'User Management', 
    href: '/dashboard/super-admin/user-management', 
    icon: Users, 
    roles: ['super_admin'],
    description: 'Manage system users and permissions'
  },
  { 
    name: 'System Settings', 
    href: '/dashboard/settings', 
    icon: Settings, 
    roles: ['super_admin'],
    description: 'Configure system-wide settings'
  },
  { 
    name: 'Audit Logs', 
    href: '/dashboard/audit', 
    icon: Shield, 
    roles: ['super_admin'],
    description: 'View system audit trails'
  },

  // Doctor Routes
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Activity, 
    roles: ['doctor'],
    description: 'View your doctor dashboard'
  },
  { 
    name: 'Patient List', 
    href: '/dashboard/doctor/patient-list', 
    icon: Users, 
    roles: ['doctor'],
    description: 'Manage your patient list'
  },
  { 
    name: 'Appointments', 
    href: '/dashboard/appointments', 
    icon: Calendar, 
    roles: ['doctor'],
    description: 'View and manage appointments'
  },
  { 
    name: 'Medical Records', 
    href: '/dashboard/records', 
    icon: FileText, 
    roles: ['doctor'],
    description: 'Access patient medical records'
  },
  { 
    name: 'Prescriptions', 
    href: '/dashboard/prescriptions', 
    icon: Stethoscope, 
    roles: ['doctor'],
    description: 'Manage patient prescriptions'
  },

  // Nurse Routes
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Activity, 
    roles: ['nurse'],
    description: 'View your nursing dashboard'
  },
  { 
    name: 'Task List', 
    href: '/dashboard/nurse/task-list', 
    icon: ClipboardList, 
    roles: ['nurse'],
    description: 'View assigned nursing tasks'
  },
  { 
    name: 'Patient Care', 
    href: '/dashboard/patient-care', 
    icon: UserCheck, 
    roles: ['nurse'],
    description: 'Manage patient care activities'
  },
  { 
    name: 'Vitals Entry', 
    href: '/dashboard/vitals', 
    icon: Heart, 
    roles: ['nurse'],
    description: 'Record patient vital signs'
  },

  // Patient Routes
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Activity, 
    roles: ['patient'],
    description: 'View your health dashboard'
  },
  { 
    name: 'My Appointments', 
    href: '/dashboard/appointments', 
    icon: Calendar, 
    roles: ['patient'],
    description: 'View your scheduled appointments'
  },
  { 
    name: 'Book Appointment', 
    href: '/dashboard/patient/appointment-booking', 
    icon: Calendar, 
    roles: ['patient'],
    description: 'Schedule a new appointment'
  },
  { 
    name: 'Medical History', 
    href: '/dashboard/history', 
    icon: FileText, 
    roles: ['patient'],
    description: 'View your medical history'
  },
];

export function Sidebar() {
  const { user} = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Filter navigation items based on user role
  const userNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  // Handle navigation with loading state
  const handleNavigation = async (href: string, itemName: string) => {
    try {
      setIsLoading(itemName);
      router.push(href);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Clear loading state after a short delay
      setTimeout(() => setIsLoading(null), 300);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading('logout');
      // if (logout) {
      //   await logout();
      // }
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/login');
    } finally {
      setIsLoading(null);
    }
  };

  // Get user role display name
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      'super_admin': 'Super Admin',
      'doctor': 'Doctor',
      'nurse': 'Nurse',
      'patient': 'Patient'
    };
    return roleMap[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!user) {
    return (
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="text-sm text-gray-500">Please log in</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* User Profile Section */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 w-full">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getRoleDisplayName(user.role)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {userNavigation.length > 0 ? (
          userNavigation.map((item, index) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const isLoadingItem = isLoading === item.name;
            
            return (
              <div key={`${item.name}-${index}`} className="relative">
                <Link href={item.href} className="block">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left relative",
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-gray-700 hover:bg-gray-100",
                      isLoadingItem && "opacity-50"
                    )}
                    onClick={(e) => {
                      if (isLoadingItem) {
                        e.preventDefault();
                        return;
                      }
                      handleNavigation(item.href, item.name);
                    }}
                    disabled={isLoadingItem}
                    title={item.description}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isLoadingItem && "animate-pulse"
                    )} />
                    <span className="truncate">{item.name}</span>
                    {isLoadingItem && (
                      <div className="absolute right-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </Button>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">
            <div className="mb-2">
              <Users className="w-8 h-8 mx-auto text-gray-400" />
            </div>
            No navigation items available for your role.
          </div>
        )}
      </nav>

      {/* Logout Section */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <Button
          variant="ghost"
          className="w-full justify-start text-left text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
          disabled={isLoading === 'logout'}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">
            {isLoading === 'logout' ? 'Logging out...' : 'Logout'}
          </span>
          {isLoading === 'logout' && (
            <div className="ml-auto">
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-4 py-2 border-t border-gray-200 bg-yellow-50">
          <div className="text-xs text-yellow-800 space-y-1">
            <div className="truncate">Path: {pathname}</div>
            <div>Role: {user.role}</div>
            <div>Items: {userNavigation.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}