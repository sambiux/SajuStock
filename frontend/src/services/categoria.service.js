import { api } from './api';

export const categoriaService = {
  listar: async () => {
    return api.get('/categorias');
  },

  crear: async (nombre, descripcion) => {
    return api.post('/categorias', { nombre, descripcion });
  },
};