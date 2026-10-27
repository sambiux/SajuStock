import { api } from './api';

export const proveedorService = {
  listar: async ({ pagina = 1, limite = 20, busqueda = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('pagina', pagina);
    params.set('limite', limite);
    if (busqueda) params.set('busqueda', busqueda);
    return api.get(`/proveedores?${params.toString()}`);
  },

  obtenerUno: async (id) => api.get(`/proveedores/${id}`),
  crear:      async (datos) => api.post('/proveedores', datos),
  actualizar: async (id, datos) => api.put(`/proveedores/${id}`, datos),
  eliminar:   async (id) => api.delete(`/proveedores/${id}`),
};