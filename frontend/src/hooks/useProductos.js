import { useState, useCallback, useEffect } from 'react';
import { productoService } from '../services/producto.service';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState({ pagina: 1, limite: 20, total: 0, totalPaginas: 1 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async ({ pagina = 1, busqueda = '', categoriaId = '' } = {}) => {
    setCargando(true);
    setError('');

    try {
      const resultado = await productoService.listar({ pagina, busqueda, categoriaId });
      setProductos(resultado.productos);
      setPaginacion(resultado.paginacion);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, paginacion, cargando, error, recargar: cargar };
};