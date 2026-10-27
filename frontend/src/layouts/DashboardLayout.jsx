import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/DashboardLayout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Inicio',       soloAdmin: false },
  { to: '/productos',     label: 'Productos',     soloAdmin: false },
  { to: '/ventas',        label: 'Ventas',        soloAdmin: false },
  { to: '/inventario',    label: 'Inventario',    soloAdmin: false },
  { to: '/clientes',      label: 'Clientes',      soloAdmin: false },
  { to: '/proveedores',   label: 'Proveedores',   soloAdmin: true  },
  { to: '/reportes',      label: 'Reportes',      soloAdmin: true  },
  { to: '/configuracion', label: 'Configuración', soloAdmin: false },
];

const DashboardLayout = () => {
  const { usuario, logout, esAdmin } = useAuth();
  const [navVisible, setNavVisible] = useState(true);
  const itemsVisibles = NAV_ITEMS.filter((item) => !item.soloAdmin || esAdmin);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>

        {/* Fila 1: logo + toggle + usuario */}
        <div className={styles.filaTop}>
          <div className={styles.logoZona}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}></span>
              <span className={styles.logoText}>sajuStock</span>
            </div>

            <button
              onClick={() => setNavVisible((v) => !v)}
              className={styles.toggleBtn}
              title={navVisible ? 'Ocultar navegación' : 'Mostrar navegación'}
            >
              <span className={`${styles.toggleIcon} ${navVisible ? styles.toggleIconOpen : ''}`}>
                ‹
              </span>
              <span className={styles.toggleLabel}>
                {navVisible ? 'Ocultar menú' : 'Mostrar menú'}
              </span>
            </button>
          </div>

          <div className={styles.usuarioMenu}>
            <span className={styles.usuarioNombre}>{usuario?.nombre}</span>
            <div className={styles.avatar}>
              {usuario?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            <button onClick={logout} className={styles.botonLogout}>
              Salir
            </button>
          </div>
        </div>

        {/* Fila 2: nav con animación */}
        <div className={`${styles.navWrapper} ${navVisible ? styles.navWrapperVisible : styles.navWrapperHidden}`}>
          <nav className={styles.nav}>
            {itemsVisibles.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

      </header>

      <main className={`${styles.content} ${!navVisible ? styles.contentExpanded : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;