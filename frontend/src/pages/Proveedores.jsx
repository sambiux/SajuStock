import { useState, useCallback } from 'react';
import { useProveedores } from '../hooks/useProveedores';
import { proveedorService } from '../services/proveedor.service';
import ProveedorForm from '../components/ProveedorForm';
import styles from '../styles/PaginaTabla.module.css';

const Proveedores = () => {
  const { proveedores, paginacion, cargando, error, recargar } = useProveedores();
  const [busqueda, setBusqueda]           = useState('');
  const [modalAbierto, setModalAbierto]   = useState(false);
  const [proveedorEditar, setProveedorEditar] = useState(null);
  const [guardando, setGuardando]         = useState(false);

  const handleBuscar = useCallback((e) => {
    e?.preventDefault();
    recargar({ pagina: 1, busqueda });
  }, [busqueda, recargar]);

  const abrirCrear = () => { setProveedorEditar(null); setModalAbierto(true); };
  const abrirEditar = (p) => { setProveedorEditar(p); setModalAbierto(true); };
  const cerrarModal = () => { setModalAbierto(false); setProveedorEditar(null); };

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      if (proveedorEditar) {
        await proveedorService.actualizar(proveedorEditar.id, datos);
      } else {
        await proveedorService.crear(datos);
      }
      cerrarModal();
      recargar({ pagina: paginacion.pagina, busqueda });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (proveedor) => {
    if (!window.confirm(`¿Eliminar al proveedor "${proveedor.nombre}"?`)) return;
    try {
      await proveedorService.eliminar(proveedor.id);
      recargar({ pagina: paginacion.pagina, busqueda });
    } catch (err) {
      alert(err.message || 'Error al eliminar el proveedor');
    }
  };

  const cambiarPagina = (nuevaPagina) => recargar({ pagina: nuevaPagina, busqueda });

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Proveedores</h1>
        <button onClick={abrirCrear} className={styles.botonNuevo}>+ Nuevo proveedor</button>
      </div>

      <form onSubmit={handleBuscar} className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.inputBusqueda}
        />
        <button type="submit" className={styles.botonFiltrar}>Buscar</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.cargando}>Cargando proveedores...</p>
      ) : proveedores.length === 0 ? (
        <p className={styles.vacio}>No se encontraron proveedores.</p>
      ) : (
        <>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.email     || '—'}</td>
                  <td>{p.telefono  || '—'}</td>
                  <td>{p.direccion || '—'}</td>
                  <td className={styles.acciones}>
                    <button onClick={() => abrirEditar(p)}    className={styles.botonEditar}>Editar</button>
                    <button onClick={() => handleEliminar(p)} className={styles.botonEliminar}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.paginacion}>
            <button disabled={paginacion.pagina <= 1} onClick={() => cambiarPagina(paginacion.pagina - 1)}>
              Anterior
            </button>
            <span>Página {paginacion.pagina} de {paginacion.totalPaginas}</span>
            <button disabled={paginacion.pagina >= paginacion.totalPaginas} onClick={() => cambiarPagina(paginacion.pagina + 1)}>
              Siguiente
            </button>
          </div>
        </>
      )}

      {modalAbierto && (
        <div className={styles.overlay} onClick={cerrarModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{proveedorEditar ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>
            <ProveedorForm
              proveedor={proveedorEditar}
              onGuardar={handleGuardar}
              onCancelar={cerrarModal}
              guardando={guardando}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;