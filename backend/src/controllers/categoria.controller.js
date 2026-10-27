const categoriaService = require('../services/categoria.service');

const listar = async (req, res, next) => {
  try {
    const categorias = await categoriaService.listarCategorias();
    return res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = await categoriaService.crearCategoria(nombre, descripcion);
    return res.status(201).json(categoria);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

module.exports = { listar, crear };