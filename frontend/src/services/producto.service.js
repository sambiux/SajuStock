import { api } from './api';

export const productoService = {
  listar: async ({ pagina = 1, limite = 20, busqueda = '', categoriaId = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('pagina', pagina);
    params.set('limite', limite);
    if (busqueda) params.set('busqueda', busqueda);
    if (categoriaId) params.set('categoriaId', categoriaId);

    return api.get(`/productos?${params.toString()}`);
  },

  obtenerUno: async (id) => {
    return api.get(`/productos/${id}`);
  },

  crear: async (datos) => {
    return api.post('/productos', datos);
  },

  actualizar: async (id, datos) => {
    return api.put(`/productos/${id}`, datos);
  },

  eliminar: async (id) => {
    return api.delete(`/productos/${id}`);
  },

  stockBajo: async () => {
    return api.get('/productos/stock-bajo');
  },
};