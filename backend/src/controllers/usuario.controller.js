const usuarioService = require('../services/usuario.service');

const listar = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await usuarioService.crearUsuario({ nombre, email, password, rol });
    return res.status(201).json(usuario);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { nombre, email, rol } = req.body;
    const usuario = await usuarioService.actualizarUsuario(req.params.id, { nombre, email, rol });
    return res.status(200).json(usuario);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const cambiarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    // Cada usuario solo puede cambiar su propia contraseña
    await usuarioService.cambiarPassword(req.usuario.id, { passwordActual, passwordNueva });
    return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const toggleActivo = async (req, res, next) => {
  try {
    const usuario = await usuarioService.toggleActivo(req.params.id, req.usuario.id);
    return res.status(200).json(usuario);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

module.exports = { listar, crear, actualizar, cambiarPassword, toggleActivo };