const { body, param, query } = require('express-validator');

const validarCrearVenta = [
  body('clienteId')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Cliente inválido'),

  body('notas')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas son demasiado largas'),

  body('items')
    .isArray({ min: 1 }).withMessage('La venta debe tener al menos un producto'),

  body('items.*.productoId')
    .isInt({ min: 1 }).withMessage('Producto inválido'),

  body('items.*.cantidad')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),
];

const validarIdVenta = [
  param('id').isInt({ min: 1 }).withMessage('ID de venta inválido'),
];

const validarBusqueda = [
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),

  query('fechaDesde')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),

  query('fechaHasta')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),

  query('clienteId')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Cliente inválido'),
];

module.exports = { validarCrearVenta, validarIdVenta, validarBusqueda };