const pool = require('../config/db');

const listar = async () => {
  const result = await pool.query(
    `SELECT id, nombre, email, rol, activo, creado_en
     FROM usuarios
     ORDER BY creado_en DESC`
  );
  return result.rows;
};

const encontrarPorId = async (id) => {
  const result = await pool.query(
    `SELECT id, nombre, email, rol, activo, creado_en
     FROM usuarios WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorIdConHash = async (id) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorEmail = async (email) => {
  const result = await pool.query(
    'SELECT id FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

const crear = async ({ nombre, email, passwordHash, rol }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, activo, creado_en`,
    [nombre, email, passwordHash, rol]
  );
  return result.rows[0];
};

const actualizar = async (id, { nombre, email, rol }) => {
  const result = await pool.query(
    `UPDATE usuarios
     SET nombre = $1, email = $2, rol = $3
     WHERE id = $4
     RETURNING id, nombre, email, rol, activo, creado_en`,
    [nombre, email, rol, id]
  );
  return result.rows[0] || null;
};

const cambiarPassword = async (id, passwordHash) => {
  await pool.query(
    'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
    [passwordHash, id]
  );
};

const toggleActivo = async (id, activo) => {
  const result = await pool.query(
    `UPDATE usuarios SET activo = $1 WHERE id = $2
     RETURNING id, nombre, email, rol, activo`,
    [activo, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  listar,
  encontrarPorId,
  encontrarPorIdConHash,
  encontrarPorEmail,
  crear,
  actualizar,
  cambiarPassword,
  toggleActivo,
};