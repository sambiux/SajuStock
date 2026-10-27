const clienteService = require('../services/cliente.service');

const mapearBody = (body) => ({
  nombre: body.nombre,
  email: body.email,
  telefono: body.telefono,
  direccion: body.direccion,
  documento: body.documento,
});

const crear = async (req, res, next) => {
  try {
    const cliente = await clienteService.crearCliente(mapearBody(req.body));
    return res.status(201).json(cliente);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const cliente = await clienteService.actualizarCliente(req.params.id, mapearBody(req.body));
    return res.status(200).json(cliente);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await clienteService.eliminarCliente(req.params.id);
    return res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const obtenerUno = async (req, res, next) => {
  try {
    const cliente = await clienteService.obtenerCliente(req.params.id);
    return res.status(200).json(cliente);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { pagina, limite, busqueda } = req.query;
    const resultado = await clienteService.listarClientes({ pagina, limite, busqueda });
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const historial = async (req, res, next) => {
  try {
    const compras = await clienteService.obtenerHistorialCompras(req.params.id);
    return res.status(200).json(compras);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

module.exports = { crear, actualizar, eliminar, obtenerUno, listar, historial };