const { query } = require('express-validator');

const validarRangoFechas = [
  query('fechaDesde')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),

  query('fechaHasta')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
];

module.exports = { validarRangoFechas };