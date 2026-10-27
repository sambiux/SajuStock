import { api } from './api';

export const compraService = {
  listar: async ({ pagina = 1, limite = 20, fechaDesde = '', fechaHasta = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('pagina', pagina);
    params.set('limite', limite);
    if (fechaDesde) params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params.set('fechaHasta', fechaHasta);
    return api.get(`/compras?${params.toString()}`);
  },

  obtenerUno: async (id) => {
    return api.get(`/compras/${id}`);
  },

  crear: async (datos) => {
    return api.post('/compras', datos);
  },
};