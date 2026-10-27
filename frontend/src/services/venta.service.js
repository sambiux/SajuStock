import { api } from './api';

export const ventaService = {
  listar: async ({ pagina = 1, limite = 20, clienteId = '', fechaDesde = '', fechaHasta = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('pagina', pagina);
    params.set('limite', limite);
    if (clienteId) params.set('clienteId', clienteId);
    if (fechaDesde) params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params.set('fechaHasta', fechaHasta);

    return api.get(`/ventas?${params.toString()}`);
  },

  obtenerUno: async (id) => {
    return api.get(`/ventas/${id}`);
  },

  crear: async (datos) => {
    return api.post('/ventas', datos);
  },

  anular: async (id) => {
    return api.patch(`/ventas/${id}/anular`);
  },
};