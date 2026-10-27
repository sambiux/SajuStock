import { api } from './api';

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password }, false);
  },

  registrar: async (datos) => {
    return api.post('/auth/registro', datos);
  },

  obtenerPerfil: async () => {
    return api.get('/auth/perfil');
  },
};
