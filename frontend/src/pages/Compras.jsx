import { useState } from 'react';
import { useCompras } from '../hooks/useCompras';
import { compraService } from '../services/compra.service';
import CompraForm from '../components/CompraForm';
import styles from '../styles/Productos.module.css';

const Compras = () => {
  const { compras, paginacion, cargando, error, recargar } = useCompras();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      await compraService.crear(datos);
      setModalAbierto(false);
      recargar();
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    recargar({ pagina: nuevaPagina });
  };

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Compras</h1>
        <button onClick={() => setModalAbierto(true)} className={styles.botonNuevo}>
          + Registrar compra
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.cargando}>Cargando compras...</p>
      ) : compras.length === 0 ? (
        <p className={styles.vacio}>No hay compras registradas.</p>
      ) : (
        <>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Compra #</th>
                <th>Proveedor</th>
                <th>Registrada por</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.proveedor || '—'}</td>
                  <td>{c.usuario_nombre}</td>
                  <td>{new Date(c.creado_en).toLocaleDateString('es-CO')}</td>
                  <td>S/ {parseFloat(c.total).toFixed(2)}</td>
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
            <h2>Registrar compra</h2>
            <CompraForm
              onGuardar={handleGuardar}
              onCancelar={() => setModalAbierto(false)}
              guardando={guardando}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Compras;