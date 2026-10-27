import { api } from './api';

export const dashboardService = {
  obtenerResumen: async () => {
    return api.get('/dashboard/resumen');
  },
};