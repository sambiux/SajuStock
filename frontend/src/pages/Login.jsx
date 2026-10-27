import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import TypedInfo from '../components/typedInfo';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}></span>
          <span className={styles.logoText}>SajuStock</span>
        </div>
      </header>

      <main className={styles.main}>
        
        <section className={styles.formSection}>

          <div className={styles.typedContainer}>
            <TypedInfo />
        </div>

          <h1 className={styles.titulo}>Log in</h1>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              autoComplete="email"
              className={styles.input}
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              autoComplete="current-password"
              className={styles.input}
            />

            <button type="submit" className={styles.botonLogin} disabled={cargando}>
              {cargando ? 'Iniciando...' : 'Log in'}
            </button>
          </form>
        </section>

        <section className={styles.mockupSection}>
          <div className={styles.mockupWindow}>
            <div className={styles.mockupBar}>
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
              <span className={styles.mockupDot} />
            </div>
            <div className={styles.mockupInner}>
              <div className={styles.mockupSidebar}>
                <div className={styles.mockupSidebarLogo}>
                  <span className={styles.mockupLogoIcon}></span>
                  <span>sajuStock</span>
                </div>
                {['Inicio', 'Productos', 'Ventas', 'Inventario', 'Clientes', 'Proveedores', 'Reportes', 'Configuración'].map((item, i) => (
                  <div key={item} className={`${styles.mockupNavItem} ${i === 0 ? styles.mockupNavActive : ''}`}>
                    {item}
                  </div>
                ))}
              </div>

              <div className={styles.mockupContent}>
                <p className={styles.mockupWelcome}>¡Bienvenido de vuelta! 👋</p>
                <p className={styles.mockupSub}>Aquí tienes un resumen de tu negocio.</p>

                <div className={styles.mockupCards}>
                  {[
                    { label: 'Ventas del día', val: 'S/ 2,450' },
                    { label: 'Productos', val: '128' },
                    { label: 'Stock bajo', val: '15' },
                    { label: 'Clientes', val: '256' },
                  ].map((c) => (
                    <div key={c.label} className={styles.mockupCard}>
                      <div className={styles.mockupCardIcon} />
                      <span className={styles.mockupCardVal}>{c.val}</span>
                      <span className={styles.mockupCardLabel}>{c.label}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.mockupChart}>
                  <div className={styles.mockupChartLine} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;