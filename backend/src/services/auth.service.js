const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const login = async (usuario) => {
  // El usuario ya fue validado por Passport en el controlador
  const token = generarToken(usuario);
  return { token, usuario };
};

const registrar = async ({ nombre, email, password, rol }) => {
  const existente = await authRepository.encontrarPorEmail(email);

  if (existente) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const passwordHash = await bcrypt.hash(password, rounds);

  const nuevoUsuario = await authRepository.crear({ nombre, email, passwordHash, rol });
  const token = generarToken(nuevoUsuario);

  return { token, usuario: nuevoUsuario };
};

const obtenerPerfil = async (id) => {
  const usuario = await authRepository.encontrarPorId(id);

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

module.exports = { login, registrar, obtenerPerfil };
