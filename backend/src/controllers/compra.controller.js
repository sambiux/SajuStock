const compraService = require('../services/compra.service');

const crear = async (req, res, next) => {
  try {
    const { proveedor, notas, items } = req.body;
    const compra = await compraService.registrarCompra({
      usuarioId: req.usuario.id,
      proveedor,
      notas,
      items,
    });
    return res.status(201).json(compra);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const obtenerUno = async (req, res, next) => {
  try {
    const compra = await compraService.obtenerCompra(req.params.id);

    // Empleado solo puede ver sus propias compras
    if (req.usuario.rol !== 'admin' && compra.usuario_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permisos para ver esta compra' });
    }

    return res.status(200).json(compra);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const { pagina, limite, fechaDesde, fechaHasta } = req.query;

    // Admin ve todas, empleado solo las suyas
    const usuarioId = req.usuario.rol === 'admin' ? null : req.usuario.id;

    const resultado = await compraService.listarCompras({
      pagina,
      limite,
      fechaDesde,
      fechaHasta,
      usuarioId,
    });

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = { crear, obtenerUno, listar };