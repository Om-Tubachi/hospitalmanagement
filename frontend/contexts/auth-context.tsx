// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export type UserRole = 'super_admin' | 'doctor' | 'nurse' | 'patient';

// interface User {
//   id: string;
//   email: string;
//   role: UserRole;
//   profile?: {
//     first_name: string;
//     last_name: string;
//     phone?: string;
//     department?: string;
//     specialization?: string;
//     license?: string;
//     emergency_contact?: any;
//   };
//   is_active: boolean;
//   last_login?: string;
//   created_at: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<{ error?: string }>;
//   signUp: (email: string, password: string, role: UserRole, profile: any) => Promise<{ error?: string }>;
//   signOut: () => Promise<void>;
//   hasRole: (role: UserRole) => boolean;
//   hasAnyRole: (roles: UserRole[]) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Check for stored user session
//     const storedUser = localStorage.getItem('medora_user');
//     const storedToken = localStorage.getItem('medora_token');
    
//     if (storedUser && storedToken) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         localStorage.removeItem('medora_user');
//         localStorage.removeItem('medora_token');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         return { error: data.error || 'Login failed' };
//       }

//       setUser(data.user);
//       localStorage.setItem('medora_user', JSON.stringify(data.user));
//       localStorage.setItem('medora_token', data.token);
      
//       return {};
//     } catch (error) {
//       return { error: 'Network error. Please try again.' };
//     }
//   };

//   const signUp = async (email: string, password: string, role: UserRole, profile: any) => {
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password, role, profile }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         return { error: data.error || 'Registration failed' };
//       }

//       setUser(data.user);
//       localStorage.setItem('medora_user', JSON.stringify(data.user));
//       localStorage.setItem('medora_token', data.token);

//       return {};
//     } catch (error) {
//       return { error: 'Network error. Please try again.' };
//     }
//   };

//   const signOut = async () => {
//     setUser(null);
//     localStorage.removeItem('medora_user');
//     localStorage.removeItem('medora_token');
//     router.push('/login');
//   };

//   const hasRole = (role: UserRole) => {
//     return user?.role === role;
//   };

//   const hasAnyRole = (roles: UserRole[]) => {
//     return user ? roles.includes(user.role) : false;
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       signIn,
//       signUp,
//       signOut,
//       hasRole,
//       hasAnyRole,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'super_admin' | 'doctor' | 'nurse' | 'patient';

interface User {
  id: string;
  email: string;
  role: UserRole;
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, role: UserRole, profile: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Backend API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('medora_user');
    const storedToken = localStorage.getItem('medora_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('medora_user');
        localStorage.removeItem('medora_token');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      setUser(data.user);
      localStorage.setItem('medora_user', JSON.stringify(data.user));
      localStorage.setItem('medora_token', data.token);
      
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'Network error. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, profile: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role, profile }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      localStorage.setItem('medora_user', JSON.stringify(data.user));
      localStorage.setItem('medora_token', data.token);

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'Network error. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      // Optional: Call backend logout endpoint
      const token = localStorage.getItem('medora_token');
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('medora_user');
      localStorage.removeItem('medora_token');
      router.push('/login');
    }
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      hasRole,
      hasAnyRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}