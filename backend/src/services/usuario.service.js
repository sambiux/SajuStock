const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuario.repository');

const listarUsuarios = async () => {
  return usuarioRepository.listar();
};

const crearUsuario = async ({ nombre, email, password, rol }) => {
  const existente = await usuarioRepository.encontrarPorEmail(email);
  if (existente) {
    const error = new Error('Ya existe un usuario con ese email');
    error.statusCode = 409;
    throw error;
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const passwordHash = await bcrypt.hash(password, rounds);

  return usuarioRepository.crear({ nombre, email, passwordHash, rol });
};

const actualizarUsuario = async (id, { nombre, email, rol }) => {
  const existente = await usuarioRepository.encontrarPorEmail(email);
  if (existente && existente.id !== parseInt(id, 10)) {
    const error = new Error('Ya existe un usuario con ese email');
    error.statusCode = 409;
    throw error;
  }

  const usuario = await usuarioRepository.actualizar(id, { nombre, email, rol });
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

const cambiarPassword = async (id, { passwordActual, passwordNueva }) => {
  const usuario = await usuarioRepository.encontrarPorIdConHash(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const valido = await bcrypt.compare(passwordActual, usuario.password_hash);
  if (!valido) {
    const error = new Error('La contraseña actual es incorrecta');
    error.statusCode = 401;
    throw error;
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const passwordHash = await bcrypt.hash(passwordNueva, rounds);

  await usuarioRepository.cambiarPassword(id, passwordHash);
};

const toggleActivo = async (id, solicitanteId) => {
  if (parseInt(id, 10) === parseInt(solicitanteId, 10)) {
    const error = new Error('No puedes desactivar tu propia cuenta');
    error.statusCode = 400;
    throw error;
  }

  const usuario = await usuarioRepository.encontrarPorId(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return usuarioRepository.toggleActivo(id, !usuario.activo);
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarPassword,
  toggleActivo,
};