const { body, param } = require('express-validator');

const validarCrearUsuario = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6, max: 72 }).withMessage('La contraseña debe tener entre 6 y 72 caracteres'),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['admin', 'empleado']).withMessage('Rol inválido'),
];

const validarActualizarUsuario = [
  param('id').isInt({ min: 1 }).withMessage('ID de usuario inválido'),

  body('nombre')
  .trim()
  .notEmpty().withMessage('El nombre es obligatorio')
  .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
  .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/)
  .withMessage('El nombre solo puede contener letras, espacios y los símbolos: - \' .'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail(),

  body('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['admin', 'empleado']).withMessage('Rol inválido'),
];

const validarCambiarPassword = [
  body('passwordActual')
    .notEmpty().withMessage('La contraseña actual es obligatoria'),

  body('passwordNueva')
    .notEmpty().withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 6, max: 72 }).withMessage('La contraseña debe tener entre 6 y 72 caracteres'),
];

const validarIdUsuario = [
  param('id').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
];

module.exports = {
  validarCrearUsuario,
  validarActualizarUsuario,
  validarCambiarPassword,
  validarIdUsuario,
};