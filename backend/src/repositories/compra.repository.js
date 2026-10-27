const pool = require('../config/db');

const crearConItems = async ({ usuarioId, proveedor, notas, items }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let total = 0;
    const lineasValidadas = [];

    for (const item of items) {
      const productoResult = await client.query(
        `SELECT id, nombre FROM productos WHERE id = $1 AND activo = true FOR UPDATE`,
        [item.productoId]
      );

      const producto = productoResult.rows[0];

      if (!producto) {
        const error = new Error(`El producto con ID ${item.productoId} no existe`);
        error.statusCode = 404;
        throw error;
      }

      const subtotal = item.precioUnitario * item.cantidad;
      total += subtotal;

      lineasValidadas.push({
        productoId: producto.id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal,
      });
    }

    // Inserta la cabecera de la compra
    const compraResult = await client.query(
      `INSERT INTO compras (usuario_id, proveedor, total, notas)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [usuarioId, proveedor || null, total, notas || null]
    );
    const compra = compraResult.rows[0];

    // Inserta cada línea y aumenta el stock
    for (const linea of lineasValidadas) {
      await client.query(
        `INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [compra.id, linea.productoId, linea.cantidad, linea.precioUnitario, linea.subtotal]
      );

      await client.query(
        `UPDATE productos
         SET stock = stock + $1,
             precio_compra = $2,
             actualizado_en = NOW()
         WHERE id = $3`,
        [linea.cantidad, linea.precioUnitario, linea.productoId]
      );
    }

    await client.query('COMMIT');

    return { ...compra, items: lineasValidadas };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const encontrarPorId = async (id) => {
  const compraResult = await pool.query(
    `SELECT c.*, u.nombre AS usuario_nombre
     FROM compras c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.id = $1`,
    [id]
  );

  const compra = compraResult.rows[0];
  if (!compra) return null;

  const itemsResult = await pool.query(
    `SELECT dc.*, p.nombre AS producto_nombre, p.codigo AS producto_codigo
     FROM detalle_compras dc
     JOIN productos p ON p.id = dc.producto_id
     WHERE dc.compra_id = $1`,
    [id]
  );

  return { ...compra, items: itemsResult.rows };
};

const listar = async ({ pagina = 1, limite = 20, fechaDesde = null, fechaHasta = null, usuarioId = null }) => {
  const offset = (pagina - 1) * limite;
  const condiciones = [];
  const valores = [];
  let idx = 1;

  // Si viene usuarioId, filtra solo sus compras (empleado)
  // Si no viene, trae todas (admin)
  if (usuarioId) {
    condiciones.push(`c.usuario_id = $${idx}`);
    valores.push(usuarioId);
    idx++;
  }

  if (fechaDesde) {
    condiciones.push(`c.creado_en >= $${idx}`);
    valores.push(fechaDesde);
    idx++;
  }

  if (fechaHasta) {
    condiciones.push(`c.creado_en <= $${idx}`);
    valores.push(fechaHasta);
    idx++;
  }

  const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const dataQuery = `
    SELECT c.*, u.nombre AS usuario_nombre
    FROM compras c
    JOIN usuarios u ON u.id = c.usuario_id
    ${whereClause}
    ORDER BY c.creado_en DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  valores.push(limite, offset);

  const countQuery = `SELECT COUNT(*) FROM compras c ${whereClause}`;
  const countValores = valores.slice(0, idx - 1);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, valores),
    pool.query(countQuery, countValores),
  ]);

  return {
    compras: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
};

module.exports = { crearConItems, encontrarPorId, listar };