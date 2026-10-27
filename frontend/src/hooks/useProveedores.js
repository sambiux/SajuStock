import { useState, useCallback, useEffect } from 'react';
import { proveedorService } from '../services/proveedor.service';

export const useProveedores = () => {
  const [proveedores, setProveedores]   = useState([]);
  const [paginacion, setPaginacion]     = useState({ pagina: 1, limite: 20, total: 0, totalPaginas: 1 });
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState('');

  const cargar = useCallback(async ({ pagina = 1, busqueda = '' } = {}) => {
    setCargando(true);
    setError('');
    try {
      const resultado = await proveedorService.listar({ pagina, busqueda });
      setProveedores(resultado.proveedores);
      setPaginacion(resultado.paginacion);
    } catch (err) {
      setError(err.message || 'Error al cargar proveedores');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return { proveedores, paginacion, cargando, error, recargar: cargar };
};