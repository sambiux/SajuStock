import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Compras from './pages/Compras';
import Reportes from './pages/Reportes';
import Proveedores from './pages/Proveedores';
import Configuracion from './pages/Configuracion';
import './styles/global.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rutas accesibles para todos los usuarios autenticados */}
          <Route element={<RutaProtegida><DashboardLayout /></RutaProtegida>}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/productos"  element={<Productos />} />
            <Route path="/ventas"     element={<Ventas />} />
            <Route path="/inventario" element={<Compras />} />
            <Route path="/clientes"   element={<Clientes />} />
            <Route path="/configuracion" element={<Configuracion />} />


            {/* Rutas exclusivas para admin */}
            <Route path="/proveedores"   element={<RutaProtegida soloAdmin><Proveedores /></RutaProtegida>} />
            <Route path="/reportes"      element={<RutaProtegida soloAdmin><Reportes /></RutaProtegida>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;