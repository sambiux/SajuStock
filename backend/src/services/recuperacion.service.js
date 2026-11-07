const crypto = require('crypto');
const bcrypt = require('bcrypt');
const authRepository = require('../repositories/auth.repository');
const recuperacionRepository = require('../repositories/recuperacion.repository');
const { enviarCorreo } = require('../utils/mailer');

const MINUTOS_VIGENCIA = 60;

// En la base de datos solo se guarda el hash del token, nunca el token original
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const construirCorreo = (nombre, enlace) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="color: #E85B2A;">SajuStock</h2>
    <p>Hola ${nombre},</p>
    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.
       Haz clic en el botón para crear una nueva:</p>
    <p style="text-align: center; margin: 2rem 0;">
      <a href="${enlace}"
         style="background: #E85B2A; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
        Restablecer contraseña
      </a>
    </p>
    <p style="font-size: 0.85rem; color: #666;">
      El enlace es válido por ${MINUTOS_VIGENCIA} minutos y solo puede usarse una vez.
      Si no fuiste tú, ignora este mensaje.
    </p>
  </div>
`;

const solicitarRecuperacion = async (email) => {
  const usuario = await authRepository.encontrarPorEmail(email);

  // Si el correo no existe o la cuenta está inactiva no se hace nada ni se avisa,
  // para no revelar qué correos están registrados
  if (!usuario || !usuario.activo) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expiraEn = new Date(Date.now() + MINUTOS_VIGENCIA * 60 * 1000);

  await recuperacionRepository.invalidarTokensDelUsuario(usuario.id);
  await recuperacionRepository.crearToken({
    usuarioId: usuario.id,
    tokenHash: hashToken(token),
    expiraEn,
  });

  const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  const enlace = `${baseUrl}/restablecer-password?token=${token}`;

  // Solo en desarrollo: permite probar el flujo sin configurar el correo
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[RECUPERACIÓN] Enlace para ${email}: ${enlace}`);
  }

  try {
    await enviarCorreo({
      para: usuario.email,
      asunto: 'Restablece tu contraseña de SajuStock',
      html: construirCorreo(usuario.nombre, enlace),
    });
  } catch (error) {
    console.error('[RECUPERACIÓN] No se pudo enviar el correo:', error.message);
  }
};

const restablecerPassword = async ({ token, passwordNueva }) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const passwordHash = await bcrypt.hash(passwordNueva, rounds);

  const usuarioId = await recuperacionRepository.restablecerConToken({
    tokenHash: hashToken(token),
    passwordHash,
  });

  if (!usuarioId) {
    const error = new Error('El enlace no es válido o ya venció. Solicita uno nuevo.');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { solicitarRecuperacion, restablecerPassword };