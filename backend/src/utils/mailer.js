const enviarCorreo = async ({ para, asunto, html }) => {
  const respuesta = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: process.env.MAIL_FROM_NAME || 'SajuStock',
        email: process.env.MAIL_FROM,
      },
      to: [{ email: para }],
      subject: asunto,
      htmlContent: html,
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`Brevo respondió ${respuesta.status}: ${detalle}`);
  }
};

module.exports = { enviarCorreo };