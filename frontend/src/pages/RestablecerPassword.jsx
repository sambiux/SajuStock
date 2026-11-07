import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { recuperacionService } from '../services/recuperacion.service';
import styles from '../styles/Recuperacion.module.css';

const RestablecerPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ passwordNueva: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.passwordNueva !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {
      await recuperacionService.restablecer(token, form.passwordNueva);
      setExito(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña');
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

        <h1 className={styles.titulo}>Nueva contraseña</h1>

        {!token ? (
          <>
            <p className={styles.error}>El enlace no es válido. Solicita uno nuevo.</p>
            <Link to="/olvide-password" className={styles.link}>Solicitar un enlace nuevo</Link>
          </>
        ) : exito ? (
          <p className={styles.exito}>
            Contraseña actualizada correctamente. Te llevaremos al inicio de sesión...
          </p>
        ) : (
          <>
            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="password"
                name="passwordNueva"
                value={form.passwordNueva}
                onChange={handleChange}
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                required
                minLength={6}
                autoComplete="new-password"
                className={styles.input}
              />
              <input
                type="password"
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                placeholder="Confirmar nueva contraseña"
                required
                autoComplete="new-password"
                className={styles.input}
              />
              <button type="submit" className={styles.boton} disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>

            <Link to="/olvide-password" className={styles.link}>Solicitar un enlace nuevo</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default RestablecerPassword;