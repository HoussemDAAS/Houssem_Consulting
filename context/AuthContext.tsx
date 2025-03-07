'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch('/api/auth/me', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
        
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser({ ...userData, token });
  //       }
  //     } catch (error) {
  //       console.error('Auth verification failed:', error);
  //     } finally {
  //       setLoading(false); // Move to finally block
  //     }
  //   };

  //   verifyAuth();
  // }, []);
  const login = (userData: User) => {
    localStorage.setItem('token', userData.token); // Store only token
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token: userData.token
    });
  };
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Merge token with user data
          setUser({ 
            ...userData,
            token // Ensure token is included in user object
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
  
    verifyAuth();
  }, []);
  const logout = () => {
    localStorage.removeItem('token');
    // Clear cookies for server-side
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);