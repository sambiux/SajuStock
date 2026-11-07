const pool = require('../config/db');

const invalidarTokensDelUsuario = async (usuarioId) => {
  await pool.query(
    'UPDATE password_resets SET usado = true WHERE usuario_id = $1 AND usado = false',
    [usuarioId]
  );
};

const crearToken = async ({ usuarioId, tokenHash, expiraEn }) => {
  await pool.query(
    `INSERT INTO password_resets (usuario_id, token_hash, expira_en)
     VALUES ($1, $2, $3)`,
    [usuarioId, tokenHash, expiraEn]
  );
};

// Valida el token, cambia la contraseña y marca el token como usado en una sola transacción
const restablecerConToken = async ({ tokenHash, passwordHash }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT pr.id, pr.usuario_id
       FROM password_resets pr
       JOIN usuarios u ON u.id = pr.usuario_id
       WHERE pr.token_hash = $1
         AND pr.usado = false
         AND pr.expira_en > NOW()
         AND u.activo = true
       FOR UPDATE OF pr`,
      [tokenHash]
    );

    const registro = result.rows[0];

    if (!registro) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
      [passwordHash, registro.usuario_id]
    );

    await client.query(
      'UPDATE password_resets SET usado = true WHERE id = $1',
      [registro.id]
    );

    await client.query('COMMIT');
    return registro.usuario_id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { invalidarTokensDelUsuario, crearToken, restablecerConToken };