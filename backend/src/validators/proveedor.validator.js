const { body, param, query } = require('express-validator');

const validarCrearProveedor = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 200 }).withMessage('El nombre debe tener entre 2 y 200 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,&]+$/)
    .withMessage('El nombre solo puede contener letras, números y los símbolos: - . , &'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail(),

  body('telefono')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 }).withMessage('El teléfono es demasiado largo')
    .matches(/^[\d\s+()-]+$/).withMessage('El teléfono solo puede contener números y símbolos: + ( ) -'),

  body('direccion')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La dirección es demasiado larga')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,#]+$/)
    .withMessage('La dirección contiene caracteres no permitidos'),

  body('notas')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Las notas son demasiado largas'),
];

const validarActualizarProveedor = [
  param('id').isInt({ min: 1 }).withMessage('ID de proveedor inválido'),
  ...validarCrearProveedor,
];

const validarIdProveedor = [
  param('id').isInt({ min: 1 }).withMessage('ID de proveedor inválido'),
];

const validarBusqueda = [
  query('pagina').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
];

module.exports = {
  validarCrearProveedor,
  validarActualizarProveedor,
  validarIdProveedor,
  validarBusqueda,
};