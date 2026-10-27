import { useState, useCallback, useEffect } from 'react';
import { clienteService } from '../services/cliente.service';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [paginacion, setPaginacion] = useState({ pagina: 1, limite: 20, total: 0, totalPaginas: 1 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async ({ pagina = 1, busqueda = '' } = {}) => {
    setCargando(true);
    setError('');

    try {
      const resultado = await clienteService.listar({ pagina, busqueda });
      setClientes(resultado.clientes);
      setPaginacion(resultado.paginacion);
    } catch (err) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { clientes, paginacion, cargando, error, recargar: cargar };
};