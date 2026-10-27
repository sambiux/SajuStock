const productoRepository = require('../repositories/producto.repository');

const crearProducto = async (datos) => {
  if (datos.codigo) {
    const existente = await productoRepository.encontrarPorCodigo(datos.codigo);
    if (existente) {
      const error = new Error('Ya existe un producto con ese código');
      error.statusCode = 409;
      throw error;
    }
  }

  return productoRepository.crear(datos);
};

const actualizarProducto = async (id, datos) => {
  const producto = await productoRepository.actualizar(id, datos);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return producto;
};

const eliminarProducto = async (id) => {
  const resultado = await productoRepository.eliminar(id);

  if (!resultado) {
    const error = new Error('Producto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return resultado;
};

const obtenerProducto = async (id) => {
  const producto = await productoRepository.encontrarPorId(id);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return producto;
};

const listarProductos = async ({ pagina, limite, busqueda, categoriaId }) => {
  const paginaNum = parseInt(pagina, 10) || 1;
  const limiteNum = parseInt(limite, 10) || 20;

  const { productos, total } = await productoRepository.listar({
    pagina: paginaNum,
    limite: limiteNum,
    busqueda,
    categoriaId,
  });

  return {
    productos,
    paginacion: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
};

const listarStockBajo = async () => {
  return productoRepository.listarStockBajo();
};

module.exports = {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProducto,
  listarProductos,
  listarStockBajo,
};