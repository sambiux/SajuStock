import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboard.service';

export const useDashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');

    try {
      const datos = await dashboardService.obtenerResumen();
      setResumen(datos);
    } catch (err) {
      setError(err.message || 'Error al cargar el dashboard');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { resumen, cargando, error, recargar: cargar };
};