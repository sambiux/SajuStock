import { api } from './api';

export const recuperacionService = {
  solicitar:   (email) => api.post('/recuperacion/solicitar', { email }, false),
  restablecer: (token, passwordNueva) =>
    api.post('/recuperacion/restablecer', { token, passwordNueva }, false),
};