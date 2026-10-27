const pool = require('../config/db');

const crear = async ({ nombre, descripcion, codigo, precioVenta, precioCompra, stock, stockMinimo, categoriaId }) => {
  const result = await pool.query(
    `INSERT INTO productos (nombre, descripcion, codigo, precio_venta, precio_compra, stock, stock_minimo, categoria_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [nombre, descripcion || null, codigo || null, precioVenta, precioCompra || null, stock ?? 0, stockMinimo ?? 5, categoriaId || null]
  );
  return result.rows[0];
};

const actualizar = async (id, { nombre, descripcion, codigo, precioVenta, precioCompra, stock, stockMinimo, categoriaId }) => {
  const result = await pool.query(
    `UPDATE productos
     SET nombre = $1, descripcion = $2, codigo = $3, precio_venta = $4,
         precio_compra = $5, stock = $6, stock_minimo = $7, categoria_id = $8,
         actualizado_en = NOW()
     WHERE id = $9 AND activo = true
     RETURNING *`,
    [nombre, descripcion || null, codigo || null, precioVenta, precioCompra || null, stock ?? 0, stockMinimo ?? 5, categoriaId || null, id]
  );
  return result.rows[0] || null;
};

const eliminar = async (id) => {
  const result = await pool.query(
    `UPDATE productos SET activo = false, actualizado_en = NOW()
     WHERE id = $1 AND activo = true
     RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorId = async (id) => {
  const result = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.id = $1 AND p.activo = true`,
    [id]
  );
  return result.rows[0] || null;
};

const encontrarPorCodigo = async (codigo) => {
  const result = await pool.query(
    'SELECT id FROM productos WHERE codigo = $1 AND activo = true',
    [codigo]
  );
  return result.rows[0] || null;
};

const listar = async ({ pagina = 1, limite = 20, busqueda = '', categoriaId = null }) => {
  const offset = (pagina - 1) * limite;
  const condiciones = ['p.activo = true'];
  const valores = [];
  let idx = 1;

  if (busqueda) {
    condiciones.push(`(p.nombre ILIKE $${idx} OR p.codigo ILIKE $${idx})`);
    valores.push(`%${busqueda}%`);
    idx++;
  }

  if (categoriaId) {
    condiciones.push(`p.categoria_id = $${idx}`);
    valores.push(categoriaId);
    idx++;
  }

  const whereClause = condiciones.join(' AND ');

  const dataQuery = `
    SELECT p.*, c.nombre AS categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    WHERE ${whereClause}
    ORDER BY p.creado_en DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  valores.push(limite, offset);

  const countQuery = `SELECT COUNT(*) FROM productos p WHERE ${whereClause}`;
  const countValores = valores.slice(0, idx - 1);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, valores),
    pool.query(countQuery, countValores),
  ]);

  return {
    productos: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
};

const listarStockBajo = async () => {
  const result = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON c.id = p.categoria_id
     WHERE p.activo = true AND p.stock <= p.stock_minimo
     ORDER BY p.stock ASC`
  );
  return result.rows;
};

module.exports = {
  crear,
  actualizar,
  eliminar,
  encontrarPorId,
  encontrarPorCodigo,
  listar,
  listarStockBajo,
};