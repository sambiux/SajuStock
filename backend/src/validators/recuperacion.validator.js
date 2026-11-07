const { body } = require('express-validator');

const validarSolicitud = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail(),
];

const validarRestablecer = [
  body('token')
    .trim()
    .notEmpty().withMessage('El enlace no es válido')
    .isHexadecimal().withMessage('El enlace no es válido')
    .isLength({ min: 64, max: 64 }).withMessage('El enlace no es válido'),

  body('passwordNueva')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 6, max: 72 }).withMessage('La contraseña debe tener entre 6 y 72 caracteres'),
];

module.exports = { validarSolicitud, validarRestablecer };