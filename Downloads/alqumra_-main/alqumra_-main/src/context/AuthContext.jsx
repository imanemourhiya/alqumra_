import { createContext, useContext, useState } from 'react';
import { USER } from '../data/mockData';

const AuthContext = createContext(null);

// Mock user database with roles
// When connected to backend, the real JWT will contain the `role` field
const MOCK_USERS = [
  { email: 'admin@alqumra.ma',   password: 'admin123',  role: 'admin',    name: 'Youssef El Amrani' },
  { email: 'staff@alqumra.ma',   password: 'staff123',  role: 'staff',    name: 'Ahmed Nouri' },
  { email: 'client@alqumra.ma',  password: 'client123', role: 'customer', name: 'Imane Mourhiya' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Check mock users first (role-based)
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ ...USER, email: found.email, name: found.name, role: found.role });
      return { success: true, role: found.role };
    }
    // Fallback: accept any credentials as customer (dev mode)
    setUser({ ...USER, email, role: 'customer' });
    return { success: true, role: 'customer' };
  };

  const logout = () => setUser(null);

  const register = (name, email, password) => {
    setUser({ ...USER, name, email, role: 'customer' });
    return { success: true, role: 'customer' };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

