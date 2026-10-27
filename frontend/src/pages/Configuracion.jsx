import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuario.service';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Configuracion.module.css';

const rolLabel = (rol) => rol === 'admin' ? 'Administrador' : 'Empleado';

const ModalUsuario = ({ usuario, onGuardar, onCerrar, guardando }) => {
  const esNuevo = !usuario;
  const [form, setForm] = useState({
    nombre:   usuario?.nombre   || '',
    email:    usuario?.email    || '',
    password: '',
    rol:      usuario?.rol      || 'empleado',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onGuardar(form);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    }
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{esNuevo ? 'Nuevo usuario' : 'Editar usuario'}</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className={styles.campo}>
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          {esNuevo && (
            <div className={styles.campo}>
              <label>Contraseña *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
          )}
          <div className={styles.campo}>
            <label>Rol *</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className={styles.acciones}>
            <button type="button" onClick={onCerrar} className={styles.botonCancelar} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className={styles.botonGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : esNuevo ? 'Crear usuario' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ModalPassword = ({ onGuardar, onCerrar, guardando }) => {
  const [form, setForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.passwordNueva !== form.confirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      await onGuardar({ passwordActual: form.passwordActual, passwordNueva: form.passwordNueva });
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar contraseña</h2>
        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label>Contraseña actual</label>
            <input name="passwordActual" type="password" value={form.passwordActual} onChange={handleChange} required />
          </div>
          <div className={styles.campo}>
            <label>Nueva contraseña</label>
            <input name="passwordNueva" type="password" value={form.passwordNueva} onChange={handleChange} required />
          </div>
          <div className={styles.campo}>
            <label>Confirmar nueva contraseña</label>
            <input name="confirmar" type="password" value={form.confirmar} onChange={handleChange} required />
          </div>

          <div className={styles.acciones}>
            <button type="button" onClick={onCerrar} className={styles.botonCancelar} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className={styles.botonGuardar} disabled={guardando}>
              {guardando ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Configuracion = () => {
  const { usuario, esAdmin } = useAuth();
  const [usuarios, setUsuarios]             = useState([]);
  const [cargando, setCargando]             = useState(false);
  const [modalUsuario, setModalUsuario]     = useState(false);
  const [modalPassword, setModalPassword]   = useState(false);
  const [usuarioEditar, setUsuarioEditar]   = useState(null);
  const [guardando, setGuardando]           = useState(false);
  const [exito, setExito]                   = useState('');
  const [error, setError]                   = useState('');

  const cargarUsuarios = async () => {
    if (!esAdmin) return;
    setCargando(true);
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  const handleGuardarUsuario = async (datos) => {
    setGuardando(true);
    try {
      if (usuarioEditar) {
        await usuarioService.actualizar(usuarioEditar.id, datos);
        mostrarExito('Usuario actualizado correctamente');
      } else {
        await usuarioService.crear(datos);
        mostrarExito('Usuario creado correctamente');
      }
      setModalUsuario(false);
      setUsuarioEditar(null);
      cargarUsuarios();
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleActivo = async (u) => {
    const accion = u.activo ? 'desactivar' : 'activar';
    if (!window.confirm(`¿${accion} al usuario "${u.nombre}"?`)) return;
    try {
      await usuarioService.toggleActivo(u.id);
      mostrarExito(`Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} correctamente`);
      cargarUsuarios();
    } catch (err) {
      setError(err.message || 'Error al cambiar estado');
    }
  };

  const handleCambiarPassword = async (datos) => {
    setGuardando(true);
    try {
      await usuarioService.cambiarPassword(datos);
      setModalPassword(false);
      mostrarExito('Contraseña actualizada correctamente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Configuración</h1>

      {exito && <p className={styles.exito}>{exito}</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* ── Perfil propio (todos los usuarios) ── */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Mi perfil</h2>
        <div className={styles.perfilCard}>
          <div className={styles.perfilAvatar}>
            {usuario?.nombre?.[0]?.toUpperCase()}
          </div>
          <div className={styles.perfilInfo}>
            <p className={styles.perfilNombre}>{usuario?.nombre}</p>
            <p className={styles.perfilEmail}>{usuario?.email}</p>
            <span className={styles.perfilRol}>{rolLabel(usuario?.rol)}</span>
          </div>
          <button
            onClick={() => setModalPassword(true)}
            className={styles.botonSecundario}
          >
             Cambiar contraseña
          </button>
        </div>
      </section>

      {/* ── Gestión de usuarios (solo admin) ── */}
      {esAdmin && (
        <section className={styles.seccion}>
          <div className={styles.seccionHeader}>
            <h2 className={styles.seccionTitulo}>Usuarios del sistema</h2>
            <button
              onClick={() => { setUsuarioEditar(null); setModalUsuario(true); }}
              className={styles.botonPrimario}
            >
              + Nuevo usuario
            </button>
          </div>

          {cargando ? (
            <p className={styles.cargando}>Cargando usuarios...</p>
          ) : (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className={!u.activo ? styles.filaInactiva : ''}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.rol === 'admin' ? styles.badgeAdmin : styles.badgeEmpleado}>
                        {rolLabel(u.rol)}
                      </span>
                    </td>
                    <td>
                      <span className={u.activo ? styles.badgeActivo : styles.badgeInactivo}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className={styles.acciones}>
                      <button
                        onClick={() => { setUsuarioEditar(u); setModalUsuario(true); }}
                        className={styles.botonEditar}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActivo(u)}
                        className={u.activo ? styles.botonDesactivar : styles.botonActivar}
                        disabled={u.id === usuario?.id}
                      >
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {modalUsuario && (
        <ModalUsuario
          usuario={usuarioEditar}
          onGuardar={handleGuardarUsuario}
          onCerrar={() => { setModalUsuario(false); setUsuarioEditar(null); }}
          guardando={guardando}
        />
      )}

      {modalPassword && (
        <ModalPassword
          onGuardar={handleCambiarPassword}
          onCerrar={() => setModalPassword(false)}
          guardando={guardando}
        />
      )}
    </div>
  );
};

export default Configuracion;