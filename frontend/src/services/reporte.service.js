import { api } from './api';

const buildParams = ({ fechaDesde, fechaHasta, limite } = {}) => {
  const params = new URLSearchParams();
  if (fechaDesde) params.set('fechaDesde', fechaDesde);
  if (fechaHasta) params.set('fechaHasta', fechaHasta);
  if (limite)     params.set('limite', limite);
  return params.toString();
};

export const reporteService = {
  productosMasVendidos: (filtros) =>
    api.get(`/reportes/productos-mas-vendidos?${buildParams(filtros)}`),

  productosStockBajo: () =>
    api.get('/reportes/stock-bajo'),

  ventasPorFecha: (filtros) =>
    api.get(`/reportes/ventas-por-fecha?${buildParams(filtros)}`),

  ventasPorCliente: (filtros) =>
    api.get(`/reportes/ventas-por-cliente?${buildParams(filtros)}`),

  resumenInventario: () =>
    api.get('/reportes/resumen-inventario'),
};