const pool = require('../config/db');

const crearConItems = async ({ clienteId, usuarioId, notas, items }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Bloquea las filas de productos involucradas y valida stock disponible
    let total = 0;
    const lineasValidadas = [];

    for (const item of items) {
      const productoResult = await client.query(
        `SELECT id, nombre, precio_venta, stock
         FROM productos
         WHERE id = $1 AND activo = true
         FOR UPDATE`,
        [item.productoId]
      );

      const producto = productoResult.rows[0];

      if (!producto) {
        const error = new Error(`El producto con ID ${item.productoId} no existe`);
        error.statusCode = 404;
        throw error;
      }

      if (producto.stock < item.cantidad) {
        const error = new Error(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
        );
        error.statusCode = 409;
        throw error;
      }

      const precioUnitario = parseFloat(producto.precio_venta);
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      lineasValidadas.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal,
      });
    }

    // 2. Inserta la cabecera de la venta
    const ventaResult = await client.query(
      `INSERT INTO ventas (cliente_id, usuario_id, total, estado, notas)
       VALUES ($1, $2, $3, 'completada', $4)
       RETURNING *`,
      [clienteId || null, usuarioId, total, notas || null]
    );
    const venta = ventaResult.rows[0];

    // 3. Inserta cada línea y descuenta el stock
    for (const linea of lineasValidadas) {
      await client.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [venta.id, linea.productoId, linea.cantidad, linea.precioUnitario, linea.subtotal]
      );

      await client.query(
        `UPDATE productos SET stock = stock - $1, actualizado_en = NOW() WHERE id = $2`,
        [linea.cantidad, linea.productoId]
      );
    }

    await client.query('COMMIT');

    return { ...venta, items: lineasValidadas };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const encontrarPorId = async (id) => {
  const ventaResult = await pool.query(
    `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
     FROM ventas v
     LEFT JOIN clientes c ON c.id = v.cliente_id
     LEFT JOIN usuarios u ON u.id = v.usuario_id
     WHERE v.id = $1`,
    [id]
  );

  const venta = ventaResult.rows[0];
  if (!venta) return null;

  const itemsResult = await pool.query(
    `SELECT dv.*, p.nombre AS producto_nombre, p.codigo AS producto_codigo
     FROM detalle_ventas dv
     JOIN productos p ON p.id = dv.producto_id
     WHERE dv.venta_id = $1`,
    [id]
  );

  return { ...venta, items: itemsResult.rows };
};

const listar = async ({ pagina = 1, limite = 20, clienteId = null, fechaDesde = null, fechaHasta = null }) => {
  const offset = (pagina - 1) * limite;
  const condiciones = [];
  const valores = [];
  let idx = 1;

  if (clienteId) {
    condiciones.push(`v.cliente_id = $${idx}`);
    valores.push(clienteId);
    idx++;
  }

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

  const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

  const dataQuery = `
    SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
    FROM ventas v
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN usuarios u ON u.id = v.usuario_id
    ${whereClause}
    ORDER BY v.creado_en DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  valores.push(limite, offset);

  const countQuery = `SELECT COUNT(*) FROM ventas v ${whereClause}`;
  const countValores = valores.slice(0, idx - 1);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, valores),
    pool.query(countQuery, countValores),
  ]);

  return {
    ventas: dataResult.rows,
    total: parseInt(countResult.rows[0].count, 10),
  };
};

const anular = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ventaResult = await client.query(
      `SELECT * FROM ventas WHERE id = $1 AND estado = 'completada' FOR UPDATE`,
      [id]
    );
    const venta = ventaResult.rows[0];

    if (!venta) {
      const error = new Error('Venta no encontrada o ya está anulada');
      error.statusCode = 404;
      throw error;
    }

    // Devuelve el stock de cada línea
    const itemsResult = await client.query(
      `SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = $1`,
      [id]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE productos SET stock = stock + $1, actualizado_en = NOW() WHERE id = $2`,
        [item.cantidad, item.producto_id]
      );
    }

    const actualizada = await client.query(
      `UPDATE ventas SET estado = 'anulada' WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query('COMMIT');
    return actualizada.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { crearConItems, encontrarPorId, listar, anular };