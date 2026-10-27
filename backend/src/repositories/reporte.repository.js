const pool = require('../config/db');

const productosMasVendidos = async ({ fechaDesde, fechaHasta, limite = 10 }) => {
  const condiciones = ["v.estado = 'completada'"];
  const valores = [];
  let idx = 1;

  if (fechaDesde) {
    condiciones.push(`v.creado_en >= $${idx}`);
    valores.push(fechaDesde);
    idx++;
  }

  if (fechaHasta) {
    condiciones.push(`v.creado_en <= $${idx}`);
    valores.push(fechaHasta);
    idx++;
  }

  valores.push(limite);

  const result = await pool.query(
    `SELECT
       p.id,
       p.nombre,
       p.codigo,
       SUM(dv.cantidad)         AS total_vendido,
       SUM(dv.subtotal)         AS total_ingresos,
       COUNT(DISTINCT dv.venta_id) AS veces_vendido
     FROM detalle_ventas dv
     JOIN productos p ON p.id = dv.producto_id
     JOIN ventas v    ON v.id = dv.venta_id
     WHERE ${condiciones.join(' AND ')}
     GROUP BY p.id, p.nombre, p.codigo
     ORDER BY total_vendido DESC
     LIMIT $${idx}`,
    valores
  );

  return result.rows;
};

const productosStockBajo = async () => {
  const result = await pool.query(
    `SELECT
       p.id,
       p.nombre,
       p.codigo,
       p.stock,
       p.stock_minimo,
       c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.activo = true AND p.stock <= p.stock_minimo
     ORDER BY p.stock ASC`
  );

  return result.rows;
};

const ventasPorFecha = async ({ fechaDesde, fechaHasta }) => {
  const result = await pool.query(
    `SELECT
       DATE(v.creado_en)           AS fecha,
       COUNT(*)                    AS cantidad_ventas,
       SUM(v.total)                AS total_ingresos,
       AVG(v.total)                AS ticket_promedio
     FROM ventas v
     WHERE v.estado = 'completada'
       AND v.creado_en >= $1
       AND v.creado_en <= $2
     GROUP BY DATE(v.creado_en)
     ORDER BY fecha ASC`,
    [fechaDesde, fechaHasta]
  );

  return result.rows;
};

const ventasPorCliente = async ({ fechaDesde, fechaHasta, limite = 10 }) => {
  const condiciones = ["v.estado = 'completada'", 'v.cliente_id IS NOT NULL'];
  const valores = [];
  let idx = 1;

  if (fechaDesde) {
    condiciones.push(`v.creado_en >= $${idx}`);
    valores.push(fechaDesde);
    idx++;
  }

  if (fechaHasta) {
    condiciones.push(`v.creado_en <= $${idx}`);
    valores.push(fechaHasta);
    idx++;
  }

  valores.push(limite);

  const result = await pool.query(
    `SELECT
       c.id,
       c.nombre,
       c.email,
       COUNT(v.id)    AS cantidad_compras,
       SUM(v.total)   AS total_gastado
     FROM ventas v
     JOIN clientes c ON c.id = v.cliente_id
     WHERE ${condiciones.join(' AND ')}
     GROUP BY c.id, c.nombre, c.email
     ORDER BY total_gastado DESC
     LIMIT $${idx}`,
    valores
  );

  return result.rows;
};

const resumenInventario = async () => {
  const result = await pool.query(
    `SELECT
       COUNT(*)                                          AS total_productos,
       SUM(stock)                                        AS total_unidades,
       SUM(stock * precio_venta)                         AS valor_venta,
       SUM(stock * COALESCE(precio_compra, 0))           AS valor_costo,
       COUNT(*) FILTER (WHERE stock <= stock_minimo)     AS productos_stock_bajo,
       COUNT(*) FILTER (WHERE stock = 0)                 AS productos_agotados
     FROM productos
     WHERE activo = true`
  );

  return result.rows[0];
};

module.exports = {
  productosMasVendidos,
  productosStockBajo,
  ventasPorFecha,
  ventasPorCliente,
  resumenInventario,
};