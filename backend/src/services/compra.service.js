const compraRepository = require('../repositories/compra.repository');

const registrarCompra = async ({ usuarioId, proveedor, notas, items }) => {
  return compraRepository.crearConItems({ usuarioId, proveedor, notas, items });
};

const obtenerCompra = async (id) => {
  const compra = await compraRepository.encontrarPorId(id);

  if (!compra) {
    const error = new Error('Compra no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return compra;
};

const listarCompras = async ({ pagina, limite, fechaDesde, fechaHasta, usuarioId = null }) => {
  const paginaNum = parseInt(pagina, 10) || 1;
  const limiteNum = parseInt(limite, 10) || 20;

  const { compras, total } = await compraRepository.listar({
    pagina: paginaNum,
    limite: limiteNum,
    fechaDesde,
    fechaHasta,
    usuarioId,
  });

  return {
    compras,
    paginacion: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
};

module.exports = { registrarCompra, obtenerCompra, listarCompras };