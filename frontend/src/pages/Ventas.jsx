import { useState } from 'react';
import { useVentas } from '../hooks/useVentas';
import { ventaService } from '../services/venta.service';
import VentaForm from '../components/VentaForm';
import styles from '../styles/PaginaTabla.module.css';


const Ventas = () => {
  const { ventas, paginacion, cargando, error, recargar } = useVentas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      await ventaService.crear(datos);
      setModalAbierto(false);
      recargar();
    } finally {
      setGuardando(false);
    }
  };

  const handleAnular = async (venta) => {
    if (!window.confirm(`¿Anular la venta #${venta.id}? Esto devolverá el stock de los productos.`)) return;

    try {
      await ventaService.anular(venta.id);
      recargar({ pagina: paginacion.pagina });
    } catch (err) {
      alert(err.message || 'Error al anular la venta');
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    recargar({ pagina: nuevaPagina });
  };

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Ventas</h1>
        <button onClick={() => setModalAbierto(true)} className={styles.botonNuevo}>+ Nueva venta</button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.cargando}>Cargando ventas...</p>
      ) : ventas.length === 0 ? (
        <p className={styles.vacio}>No hay ventas registradas.</p>
      ) : (
        <>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Venta #</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{v.cliente_nombre || 'Cliente ocasional'}</td>
                  <td>{v.usuario_nombre}</td>
                  <td>{new Date(v.creado_en).toLocaleDateString('es-CO')}</td>
                  <td>S/ {parseFloat(v.total).toFixed(2)}</td>
                  <td>
                    <span className={v.estado === 'anulada' ? styles.stockBajo : styles.stockOk}>
                      {v.estado}
                    </span>
                  </td>
                  <td className={styles.acciones}>
                    {v.estado === 'completada' && (
                      <button onClick={() => handleAnular(v)} className={styles.botonEliminar}>Anular</button>
                    )}
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
        <div className={styles.overlay} onClick={() => setModalAbierto(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Nueva venta</h2>
            <VentaForm onGuardar={handleGuardar} onCancelar={() => setModalAbierto(false)} guardando={guardando} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;