import { useState, useCallback } from 'react';
import { useClientes } from '../hooks/useClientes';
import { clienteService } from '../services/cliente.service';
import ClienteForm from '../components/ClienteForm';
import HistorialComprasModal from '../components/HistorialComprasModal';
import styles from '../styles/Productos.module.css';

const Clientes = () => {
  const { clientes, paginacion, cargando, error, recargar } = useClientes();
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteHistorial, setClienteHistorial] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleBuscar = useCallback((e) => {
    e?.preventDefault();
    recargar({ pagina: 1, busqueda });
  }, [busqueda, recargar]);

  const abrirCrear = () => {
    setClienteEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (cliente) => {
    setClienteEditar(cliente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteEditar(null);
  };

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      if (clienteEditar) {
        await clienteService.actualizar(clienteEditar.id, datos);
      } else {
        await clienteService.crear(datos);
      }
      cerrarModal();
      recargar({ pagina: paginacion.pagina, busqueda });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (cliente) => {
    if (!window.confirm(`¿Eliminar al cliente "${cliente.nombre}"?`)) return;

    try {
      await clienteService.eliminar(cliente.id);
      recargar({ pagina: paginacion.pagina, busqueda });
    } catch (err) {
      alert(err.message || 'Error al eliminar el cliente');
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    recargar({ pagina: nuevaPagina, busqueda });
  };

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Clientes</h1>
        <button onClick={abrirCrear} className={styles.botonNuevo}>+ Nuevo cliente</button>
      </div>

      <form onSubmit={handleBuscar} className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por nombre, email o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.inputBusqueda}
        />
        <button type="submit" className={styles.botonFiltrar}>Buscar</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.cargando}>Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className={styles.vacio}>No se encontraron clientes.</p>
      ) : (
        <>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.documento || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.telefono || '—'}</td>
                  <td className={styles.acciones}>
                    <button onClick={() => setClienteHistorial(c)} className={styles.botonEditar}>Historial</button>
                    <button onClick={() => abrirEditar(c)} className={styles.botonEditar}>Editar</button>
                    <button onClick={() => handleEliminar(c)} className={styles.botonEliminar}>Eliminar</button>
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
            <h2>{clienteEditar ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <ClienteForm
              cliente={clienteEditar}
              onGuardar={handleGuardar}
              onCancelar={cerrarModal}
              guardando={guardando}
            />
          </div>
        </div>
      )}

      {clienteHistorial && (
        <HistorialComprasModal cliente={clienteHistorial} onCerrar={() => setClienteHistorial(null)} />
      )}
    </div>
  );
};

export default Clientes;