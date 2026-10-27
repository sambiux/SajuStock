const pool = require('../config/db');

const crear = async ({ nombre, email, telefono, direccion, documento }) => {
  const result = await pool.query(
    `INSERT INTO clientes (nombre, email, telefono, direccion, documento)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nombre, email || null, telefono || null, direccion || null, documento || null]
  );
  return result.rows[0];
};

const actualizar = async (id, { nombre, email, telefono, direccion, documento }) => {
  const result = await pool.query(
    `UPDATE clientes
     SET nombre = $1, email = $2, telefono = $3, direccion = $4, documento = $5
     WHERE id = $6 AND activo = true
     RETURNING *`,
    [nombre, email || null, telefono || null, direccion || null, documento || null, id]
  );
  return result.rows[0] || null;
};

const eliminar = async (id) => {
  const result = await pool.query(
    `UPDATE clientes SET activo = false WHERE id = $1 AND activo = true RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorId = async (id) => {
  const result = await pool.query(
    'SELECT * FROM clientes WHERE id = $1 AND activo = true',
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorEmail = async (email) => {
  const result = await pool.query('SELECT id FROM clientes WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const encontrarPorDocumento = async (documento) => {
  const result = await pool.query('SELECT id FROM clientes WHERE documento = $1', [documento]);
  return result.rows[0] || null;
};

const listar = async ({ pagina = 1, limite = 20, busqueda = '' }) => {
  const offset = (pagina - 1) * limite;
  const condiciones = ['activo = true'];
  const valores = [];
  let idx = 1;

  if (busqueda) {
    condiciones.push(`(nombre ILIKE $${idx} OR email ILIKE $${idx} OR documento ILIKE $${idx})`);
    valores.push(`%${busqueda}%`);
    idx++;
  }

  const whereClause = condiciones.join(' AND ');

  const dataQuery = `
    SELECT * FROM clientes
    WHERE ${whereClause}
    ORDER BY creado_en DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  valores.push(limite, offset);

  const countQuery = `SELECT COUNT(*) FROM clientes WHERE ${whereClause}`;
  const countValores = valores.slice(0, idx - 1);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, valores),
    pool.query(countQuery, countValores),
  ]);

  return {
    clientes: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
};

const historialCompras = async (clienteId) => {
  const result = await pool.query(
    `SELECT v.id, v.total, v.estado, v.creado_en,
            COUNT(dv.id) AS cantidad_items
     FROM ventas v
     LEFT JOIN detalle_ventas dv ON dv.venta_id = v.id
     WHERE v.cliente_id = $1
     GROUP BY v.id
     ORDER BY v.creado_en DESC`,
    [clienteId]
  );
  return result.rows;
};

module.exports = {
  crear,
  actualizar,
  eliminar,
  encontrarPorId,
  encontrarPorEmail,
  encontrarPorDocumento,
  listar,
  historialCompras,
};