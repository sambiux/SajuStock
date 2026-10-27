import { useState, useEffect } from 'react';
import { clienteService } from '../services/cliente.service';
import styles from '../styles/Productos.module.css';

const HistorialComprasModal = ({ cliente, onCerrar }) => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    clienteService.historial(cliente.id)
      .then(setCompras)
      .catch((err) => setError(err.message || 'Error al cargar el historial'))
      .finally(() => setCargando(false));
  }, [cliente.id]);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Historial de compras — {cliente.nombre}</h2>

        {error && <p className={styles.error}>{error}</p>}

        {cargando ? (
          <p className={styles.cargando}>Cargando...</p>
        ) : compras.length === 0 ? (
          <p className={styles.vacio}>Este cliente no tiene compras registradas.</p>
        ) : (
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Venta #</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{new Date(c.creado_en).toLocaleDateString('es-CO')}</td>
                  <td>{c.cantidad_items}</td>
                  <td>S/ {parseFloat(c.total).toFixed(2)}</td>
                  <td>{c.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistorialComprasModal;