const pool = require('../config/db');

const ventasDelDia = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(total), 0) AS total, COUNT(*) AS cantidad
    FROM ventas
    WHERE estado = 'completada' AND creado_en::date = CURRENT_DATE
  `);
  return result.rows[0];
};

const ventasDeAyer = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(total), 0) AS total
    FROM ventas
    WHERE estado = 'completada' AND creado_en::date = CURRENT_DATE - INTERVAL '1 day'
  `);
  return result.rows[0];
};

const totalProductos = async () => {
  const result = await pool.query(`SELECT COUNT(*) AS total FROM productos WHERE activo = true`);
  return result.rows[0];
};

const totalProductosStockBajo = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total FROM productos
    WHERE activo = true AND stock <= stock_minimo
  `);
  return result.rows[0];
};

const totalClientes = async () => {
  const result = await pool.query(`SELECT COUNT(*) AS total FROM clientes WHERE activo = true`);
  return result.rows[0];
};

const ventasUltimos7Dias = async () => {
  const result = await pool.query(`
    SELECT
      d::date AS fecha,
      COALESCE(SUM(v.total), 0) AS total
    FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS d
    LEFT JOIN ventas v
      ON v.creado_en::date = d::date AND v.estado = 'completada'
    GROUP BY d
    ORDER BY d
  `);
  return result.rows;
};

const productosStockBajo = async (limite = 5) => {
  const result = await pool.query(
    `SELECT id, nombre, stock, stock_minimo
     FROM productos
     WHERE activo = true AND stock <= stock_minimo
     ORDER BY stock ASC
     LIMIT $1`,
    [limite]
  );
  return result.rows;
};

const ultimasVentas = async (limite = 5) => {
  const result = await pool.query(
    `SELECT v.id, v.total, v.creado_en, c.nombre AS cliente_nombre
     FROM ventas v
     LEFT JOIN clientes c ON c.id = v.cliente_id
     WHERE v.estado = 'completada'
     ORDER BY v.creado_en DESC
     LIMIT $1`,
    [limite]
  );
  return result.rows;
};

module.exports = {
  ventasDelDia,
  ventasDeAyer,
  totalProductos,
  totalProductosStockBajo,
  totalClientes,
  ventasUltimos7Dias,
  productosStockBajo,
  ultimasVentas,
};