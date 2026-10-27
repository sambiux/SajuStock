const passport = require('passport');
const authService = require('../services/auth.service');

const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, usuario, info) => {
    if (err) return next(err);

    if (!usuario) {
      return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });
    }

    try {
      const resultado = await authService.login(usuario);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const resultado = await authService.registrar({ nombre, email, password, rol });
    return res.status(201).json(resultado);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

const perfil = async (req, res, next) => {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    return res.status(200).json(usuario);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = { login, registrar, perfil };
