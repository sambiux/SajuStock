const categoriaRepository = require('../repositories/categoria.repository');

const listarCategorias = async () => {
  return categoriaRepository.listar();
};

const crearCategoria = async (nombre, descripcion) => {
  const existente = await categoriaRepository.encontrarPorNombre(nombre);

  if (existente) {
    const error = new Error('Ya existe una categoría con ese nombre');
    error.statusCode = 409;
    throw error;
  }

  return categoriaRepository.crear(nombre, descripcion);
};

module.exports = { listarCategorias, crearCategoria };