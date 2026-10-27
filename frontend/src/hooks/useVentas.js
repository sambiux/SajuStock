import { useState, useCallback, useEffect } from 'react';
import { ventaService } from '../services/venta.service';

export const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [paginacion, setPaginacion] = useState({ pagina: 1, limite: 20, total: 0, totalPaginas: 1 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (filtros = {}) => {
    setCargando(true);
    setError('');

    try {
      const resultado = await ventaService.listar(filtros);
      setVentas(resultado.ventas);
      setPaginacion(resultado.paginacion);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { ventas, paginacion, cargando, error, recargar: cargar };
};