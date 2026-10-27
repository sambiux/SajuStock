import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ children, soloAdmin = false }) => {
  const { estaAutenticado, esAdmin, cargando } = useAuth();

  if (cargando) {
    return <div>Cargando...</div>;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RutaProtegida;
