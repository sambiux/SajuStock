const recuperacionService = require('../services/recuperacion.service');

const solicitar = async (req, res, next) => {
  try {
    await recuperacionService.solicitarRecuperacion(req.body.email);
    // Misma respuesta exista o no el correo
    return res.status(200).json({
      mensaje: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (error) {
    next(error);
  }
};

const restablecer = async (req, res, next) => {
  try {
    const { token, passwordNueva } = req.body;
    await recuperacionService.restablecerPassword({ token, passwordNueva });
    return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

module.exports = { solicitar, restablecer };