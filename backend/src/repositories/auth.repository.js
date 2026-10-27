const pool = require('../config/db');

const encontrarPorEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

const encontrarPorId = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, email, rol, activo, creado_en FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const crear = async ({ nombre, email, passwordHash, rol = 'empleado' }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, activo, creado_en`,
    [nombre, email, passwordHash, rol]
  );
  return result.rows[0];
};

module.exports = { encontrarPorEmail, encontrarPorId, crear };
