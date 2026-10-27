const reporteRepository = require('../repositories/reporte.repository');

const obtenerFechasPorDefecto = () => {
  const hoy = new Date();
  const hace30Dias = new Date();
  hace30Dias.setDate(hoy.getDate() - 30);

  return {
    fechaDesde: hace30Dias.toISOString(),
    fechaHasta: hoy.toISOString(),
  };
};

const reporteProductosMasVendidos = async ({ fechaDesde, fechaHasta, limite }) => {
  const fechas = fechaDesde && fechaHasta
    ? { fechaDesde, fechaHasta }
    : obtenerFechasPorDefecto();

  return reporteRepository.productosMasVendidos({
    ...fechas,
    limite: parseInt(limite, 10) || 10,
  });
};

const reporteProductosStockBajo = async () => {
  return reporteRepository.productosStockBajo();
};

const reporteVentasPorFecha = async ({ fechaDesde, fechaHasta }) => {
  const fechas = fechaDesde && fechaHasta
    ? { fechaDesde, fechaHasta }
    : obtenerFechasPorDefecto();

  return reporteRepository.ventasPorFecha(fechas);
};

const reporteVentasPorCliente = async ({ fechaDesde, fechaHasta, limite }) => {
  const fechas = fechaDesde && fechaHasta
    ? { fechaDesde, fechaHasta }
    : obtenerFechasPorDefecto();

  return reporteRepository.ventasPorCliente({
    ...fechas,
    limite: parseInt(limite, 10) || 10,
  });
};

const reporteResumenInventario = async () => {
  return reporteRepository.resumenInventario();
};

module.exports = {
  reporteProductosMasVendidos,
  reporteProductosStockBajo,
  reporteVentasPorFecha,
  reporteVentasPorCliente,
  reporteResumenInventario,
};