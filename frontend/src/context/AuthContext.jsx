import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarPerfil = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const perfil = await authService.obtenerPerfil();
      setUsuario(perfil);
    } catch {
      localStorage.removeItem('token');
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  const login = async (email, password) => {
    const { token, usuario: datosUsuario } = await authService.login(email, password);
    localStorage.setItem('token', token);
    setUsuario(datosUsuario);
    return datosUsuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const estaAutenticado = !!usuario;
  const esAdmin = usuario?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ usuario, cargando, estaAutenticado, esAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};
