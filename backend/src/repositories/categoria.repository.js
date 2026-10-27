const pool = require('../config/db');

const listar = async () => {
  const result = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
  return result.rows;
};

const crear = async (nombre, descripcion) => {
  const result = await pool.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
    [nombre, descripcion || null]
  );
  return result.rows[0];
};

const encontrarPorNombre = async (nombre) => {
  const result = await pool.query('SELECT id FROM categorias WHERE nombre = $1', [nombre]);
  return result.rows[0] || null;
};

module.exports = { listar, crear, encontrarPorNombre };