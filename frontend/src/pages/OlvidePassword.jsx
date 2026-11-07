import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recuperacionService } from '../services/recuperacion.service';
import styles from '../styles/Recuperacion.module.css';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await recuperacionService.solicitar(email);
      setEnviado(true);
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}></span>
          <span className={styles.logoText}>SajuStock</span>
        </div>

        <h1 className={styles.titulo}>Recuperar contraseña</h1>

        {enviado ? (
          <>
            <p className={styles.exito}>
              Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
              Revisa también la carpeta de spam.
            </p>
            <Link to="/login" className={styles.link}>Volver al inicio de sesión</Link>
          </>
        ) : (
          <>
            <p className={styles.descripcion}>
              Ingresa el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
                className={styles.input}
              />
              <button type="submit" className={styles.boton} disabled={cargando}>
                {cargando ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            <Link to="/login" className={styles.link}>Volver al inicio de sesión</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default OlvidePassword;