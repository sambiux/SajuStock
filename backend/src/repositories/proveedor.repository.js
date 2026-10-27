const pool = require('../config/db');

const crear = async ({ nombre, email, telefono, direccion, notas }) => {
  const result = await pool.query(
    `INSERT INTO proveedores (nombre, email, telefono, direccion, notas)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nombre, email || null, telefono || null, direccion || null, notas || null]
  );
  return result.rows[0];
};

const actualizar = async (id, { nombre, email, telefono, direccion, notas }) => {
  const result = await pool.query(
    `UPDATE proveedores
     SET nombre = $1, email = $2, telefono = $3, direccion = $4, notas = $5
     WHERE id = $6 AND activo = true
     RETURNING *`,
    [nombre, email || null, telefono || null, direccion || null, notas || null, id]
  );
  return result.rows[0] || null;
};

const eliminar = async (id) => {
  const result = await pool.query(
    `UPDATE proveedores SET activo = false WHERE id = $1 AND activo = true RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorId = async (id) => {
  const result = await pool.query(
    'SELECT * FROM proveedores WHERE id = $1 AND activo = true',
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorEmail = async (email) => {
  const result = await pool.query(
    'SELECT id FROM proveedores WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

const listar = async ({ pagina = 1, limite = 20, busqueda = '' }) => {
  const offset = (pagina - 1) * limite;
  const condiciones = ['activo = true'];
  const valores = [];
  let idx = 1;

  if (busqueda) {
    condiciones.push(`(nombre ILIKE $${idx} OR email ILIKE $${idx})`);
    valores.push(`%${busqueda}%`);
    idx++;
  }

  const whereClause = condiciones.join(' AND ');

  const dataQuery = `
    SELECT * FROM proveedores
    WHERE ${whereClause}
    ORDER BY creado_en DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  valores.push(limite, offset);

  const countQuery = `SELECT COUNT(*) FROM proveedores WHERE ${whereClause}`;
  const countValores = valores.slice(0, idx - 1);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, valores),
    pool.query(countQuery, countValores),
  ]);

  return {
    proveedores: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
};

module.exports = { crear, actualizar, eliminar, encontrarPorId, encontrarPorEmail, listar };