const dashboardRepository = require('../repositories/dashboard.repository');

const calcularVariacion = (actual, anterior) => {
  const actualNum = parseFloat(actual);
  const anteriorNum = parseFloat(anterior);

  if (anteriorNum === 0) return actualNum > 0 ? 100 : 0;

  return Math.round(((actualNum - anteriorNum) / anteriorNum) * 100);
};

const obtenerResumen = async () => {
  const [
    ventasHoy,
    ventasAyer,
    productos,
    stockBajo,
    clientes,
    ventas7Dias,
    productosBajos,
    ultimasVentas,
  ] = await Promise.all([
    dashboardRepository.ventasDelDia(),
    dashboardRepository.ventasDeAyer(),
    dashboardRepository.totalProductos(),
    dashboardRepository.totalProductosStockBajo(),
    dashboardRepository.totalClientes(),
    dashboardRepository.ventasUltimos7Dias(),
    dashboardRepository.productosStockBajo(5),
    dashboardRepository.ultimasVentas(5),
  ]);

  return {
    ventasDelDia: {
      total: parseFloat(ventasHoy.total),
      cantidad: parseInt(ventasHoy.cantidad, 10),
      variacion: calcularVariacion(ventasHoy.total, ventasAyer.total),
    },
    productos: {
      total: parseInt(productos.total, 10),
    },
    stockBajo: {
      total: parseInt(stockBajo.total, 10),
    },
    clientes: {
      total: parseInt(clientes.total, 10),
    },
    ventasSemana: ventas7Dias.map((d) => ({
      fecha: d.fecha,
      total: parseFloat(d.total),
    })),
    productosStockBajo: productosBajos,
    ultimasVentas: ultimasVentas.map((v) => ({
      ...v,
      total: parseFloat(v.total),
    })),
  };
};

module.exports = { obtenerResumen };