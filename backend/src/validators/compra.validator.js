const { body, param, query } = require('express-validator');

const validarCrearCompra = [
  body('proveedor')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('El proveedor es demasiado largo'),

  body('notas')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas son demasiado largas'),

  body('items')
    .isArray({ min: 1 }).withMessage('La compra debe tener al menos un producto'),

  body('items.*.productoId')
    .isInt({ min: 1 }).withMessage('Producto inválido'),

  body('items.*.cantidad')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor a 0'),

  body('items.*.precioUnitario')
    .isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
];

const validarIdCompra = [
  param('id').isInt({ min: 1 }).withMessage('ID de compra inválido'),
];

const validarBusqueda = [
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),

  query('fechaDesde')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),

  query('fechaHasta')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),
];

module.exports = { validarCrearCompra, validarIdCompra, validarBusqueda };