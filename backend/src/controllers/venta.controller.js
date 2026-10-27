const ventaService = require('../services/venta.service');

const crear = async (req, res, next) => {
  try {
    const { clienteId, notas, items } = req.body;
    const venta = await ventaService.registrarVenta({
      clienteId,
      usuarioId: req.usuario.id,
      notas,
      items,
    });
    return res.status(201).json(venta);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const obtenerUno = async (req, res, next) => {
  try {
    const venta = await ventaService.obtenerVenta(req.params.id);
    return res.status(200).json(venta);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { pagina, limite, clienteId, fechaDesde, fechaHasta } = req.query;
    const resultado = await ventaService.listarVentas({ pagina, limite, clienteId, fechaDesde, fechaHasta });
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const anular = async (req, res, next) => {
  try {
    const venta = await ventaService.anularVenta(req.params.id);
    return res.status(200).json(venta);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

module.exports = { crear, obtenerUno, listar, anular };