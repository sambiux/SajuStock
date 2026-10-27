import { api } from './api';

export const usuarioService = {
  listar:          async ()           => api.get('/usuarios'),
  crear:           async (datos)      => api.post('/usuarios', datos),
  actualizar:      async (id, datos)  => api.put(`/usuarios/${id}`, datos),
  toggleActivo:    async (id)         => api.patch(`/usuarios/${id}/toggle`),
  cambiarPassword: async (datos)      => api.patch('/usuarios/cambiar-password', datos),
};