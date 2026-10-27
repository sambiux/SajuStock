const proveedorService = require('../services/proveedor.service');

const mapearBody = (body) => ({
  nombre:    body.nombre,
  email:     body.email,
  telefono:  body.telefono,
  direccion: body.direccion,
  notas:     body.notas,
});

const crear = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.crearProveedor(mapearBody(req.body));
    return res.status(201).json(proveedor);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.actualizarProveedor(req.params.id, mapearBody(req.body));
    return res.status(200).json(proveedor);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await proveedorService.eliminarProveedor(req.params.id);
    return res.status(200).json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const obtenerUno = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.obtenerProveedor(req.params.id);
    return res.status(200).json(proveedor);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { pagina, limite, busqueda } = req.query;
    const resultado = await proveedorService.listarProveedores({ pagina, limite, busqueda });
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = { crear, actualizar, eliminar, obtenerUno, listar };