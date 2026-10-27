import { useState, useCallback, useEffect } from 'react';
import { compraService } from '../services/compra.service';

export const useCompras = () => {
  const [compras, setCompras] = useState([]);
  const [paginacion, setPaginacion] = useState({ pagina: 1, limite: 20, total: 0, totalPaginas: 1 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async (filtros = {}) => {
    setCargando(true);
    setError('');
    try {
      const resultado = await compraService.listar(filtros);
      setCompras(resultado.compras);
      setPaginacion(resultado.paginacion);
    } catch (err) {
      setError(err.message || 'Error al cargar compras');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { compras, paginacion, cargando, error, recargar: cargar };
};