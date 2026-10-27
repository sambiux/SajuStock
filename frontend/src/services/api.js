const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const obtenerToken = () => localStorage.getItem('token');

const construirHeaders = (conAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };

  if (conAuth) {
    const token = obtenerToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const manejarRespuesta = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Error en la solicitud');
    error.statusCode = response.status;
    error.detalles = data.detalles || null;
    throw error;
  }

  return data;
};

export const api = {
  get: async (endpoint, conAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: construirHeaders(conAuth),
    });
    return manejarRespuesta(response);
  },

  post: async (endpoint, body, conAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: construirHeaders(conAuth),
      body: JSON.stringify(body),
    });
    return manejarRespuesta(response);
  },

  put: async (endpoint, body, conAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: construirHeaders(conAuth),
      body: JSON.stringify(body),
    });
    return manejarRespuesta(response);
  },

  patch: async (endpoint, body, conAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: construirHeaders(conAuth),
      body: JSON.stringify(body),
    });
    return manejarRespuesta(response);
  },

  delete: async (endpoint, conAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: construirHeaders(conAuth),
    });
    return manejarRespuesta(response);
  },
};
