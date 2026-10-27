const { body, param, query } = require('express-validator');

const validarCrearProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 200 }).withMessage('El nombre debe tener entre 2 y 200 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-.,()]+$/)
    .withMessage('El nombre solo puede contener letras, números y los símbolos: - . , ( )'),

  body('descripcion')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 }).withMessage('La descripción es demasiado larga'),

  body('codigo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('El código es demasiado largo')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('El código solo puede contener letras, números, guiones y guiones bajos'),

  body('precioVenta')
    .notEmpty().withMessage('El precio de venta es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio de venta debe ser un número positivo'),

  body('precioCompra')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('El precio de compra debe ser un número positivo'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

  body('stockMinimo')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero positivo'),

  body('categoriaId')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Categoría inválida'),
];

const validarActualizarProducto = [
  param('id').isInt({ min: 1 }).withMessage('ID de producto inválido'),
  ...validarCrearProducto,
];

const validarIdProducto = [
  param('id').isInt({ min: 1 }).withMessage('ID de producto inválido'),
];

const validarBusqueda = [
  query('pagina').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
  query('categoriaId').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Categoría inválida'),
];

module.exports = {
  validarCrearProducto,
  validarActualizarProducto,
  validarIdProducto,
  validarBusqueda,
};