const ventaRepository = require('../repositories/venta.repository');

const registrarVenta = async ({ clienteId, usuarioId, notas, items }) => {
  return ventaRepository.crearConItems({ clienteId, usuarioId, notas, items });
};

const obtenerVenta = async (id) => {
  const venta = await ventaRepository.encontrarPorId(id);

  if (!venta) {
    const error = new Error('Venta no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return venta;
};

const listarVentas = async ({ pagina, limite, clienteId, fechaDesde, fechaHasta }) => {
  const paginaNum = parseInt(pagina, 10) || 1;
  const limiteNum = parseInt(limite, 10) || 20;

  const { ventas, total } = await ventaRepository.listar({
    pagina: paginaNum,
    limite: limiteNum,
    clienteId,
    fechaDesde,
    fechaHasta,
  });

  return {
    ventas,
    paginacion: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
};

const anularVenta = async (id) => {
  return ventaRepository.anular(id);
};

module.exports = { registrarVenta, obtenerVenta, listarVentas, anularVenta };