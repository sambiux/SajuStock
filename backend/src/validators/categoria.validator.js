const { body } = require('express-validator');

const validarCrearCategoria = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-]+$/)
    .withMessage('El nombre solo puede contener letras, números, espacios y guiones'),

  body('descripcion')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción es demasiado larga'),
];

module.exports = { validarCrearCategoria };