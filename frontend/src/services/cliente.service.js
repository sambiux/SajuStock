import { api } from './api';

export const clienteService = {
  listar: async ({ pagina = 1, limite = 20, busqueda = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('pagina', pagina);
    params.set('limite', limite);
    if (busqueda) params.set('busqueda', busqueda);

    return api.get(`/clientes?${params.toString()}`);
  },

  obtenerUno: async (id) => {
    return api.get(`/clientes/${id}`);
  },

  crear: async (datos) => {
    return api.post('/clientes', datos);
  },

  actualizar: async (id, datos) => {
    return api.put(`/clientes/${id}`, datos);
  },

  eliminar: async (id) => {
    return api.delete(`/clientes/${id}`);
  },

  historial: async (id) => {
    return api.get(`/clientes/${id}/historial`);
  },
};