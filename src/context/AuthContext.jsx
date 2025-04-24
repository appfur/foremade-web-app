import { createContext, useState } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await api.post('/users.php', {
      action: 'login',
      email,
      password,
    });
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const register = async (email, password, role) => {
    const response = await api.post('/users.php', {
      action: 'register',
      email,
      password,
      role,
    });
    setUser(response.data);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};