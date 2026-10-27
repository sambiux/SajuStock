const productoService = require('../services/producto.service');

const mapearBody = (body) => ({
  nombre: body.nombre,
  descripcion: body.descripcion,
  codigo: body.codigo,
  precioVenta: body.precioVenta,
  precioCompra: body.precioCompra,
  stock: body.stock,
  stockMinimo: body.stockMinimo,
  categoriaId: body.categoriaId,
});

const crear = async (req, res, next) => {
  try {
    const producto = await productoService.crearProducto(mapearBody(req.body));
    return res.status(201).json(producto);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const producto = await productoService.actualizarProducto(req.params.id, mapearBody(req.body));
    return res.status(200).json(producto);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const obtenerUno = async (req, res, next) => {
  try {
    const producto = await productoService.obtenerProducto(req.params.id);
    return res.status(200).json(producto);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { pagina, limite, busqueda, categoriaId } = req.query;
    const resultado = await productoService.listarProductos({ pagina, limite, busqueda, categoriaId });
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const stockBajo = async (req, res, next) => {
  try {
    const productos = await productoService.listarStockBajo();
    return res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

module.exports = { crear, actualizar, eliminar, obtenerUno, listar, stockBajo };