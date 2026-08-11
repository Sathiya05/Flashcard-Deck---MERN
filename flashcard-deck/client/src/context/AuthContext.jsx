import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, loginAdmin, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      getMe()
        .then(res => {
          if (userType === 'admin') {
            setAdmin(res.data);
          } else {
            setUser(res.data);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userType', 'user');
    setUser(res.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userType', 'user');
    setUser(res.data);
    return res.data;
  };

  const loginAsAdmin = async (email, password) => {
    const res = await loginAdmin({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userType', 'admin');
    setAdmin(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin, 
      loading, 
      register, 
      login, 
      loginAsAdmin, 
      logout,
      isAuthenticated: !!user || !!admin,
      isAdmin: !!admin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
