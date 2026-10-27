import { useState, useEffect } from 'react';
import { productoService } from '../services/producto.service';
import { clienteService } from '../services/cliente.service';
import styles from '../styles/VentaForm.module.css';

const VentaForm = ({ onGuardar, onCancelar, guardando }) => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [notas, setNotas] = useState('');
  const [items, setItems] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    productoService.listar({ limite: 100 }).then((r) => setProductos(r.productos)).catch(() => {});
    clienteService.listar({ limite: 100 }).then((r) => setClientes(r.clientes)).catch(() => {});
  }, []);

  const agregarItem = () => {
    setError('');

    if (!productoSeleccionado) {
      setError('Selecciona un producto');
      return;
    }

    const producto = productos.find((p) => p.id === parseInt(productoSeleccionado, 10));
    if (!producto) return;

    if (cantidad < 1) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > producto.stock) {
      setError(`Stock insuficiente. Disponible: ${producto.stock}`);
      return;
    }

    const existente = items.find((i) => i.productoId === producto.id);
    if (existente) {
      setItems((prev) =>
        prev.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i))
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precioUnitario: parseFloat(producto.precio_venta),
          cantidad,
          stockDisponible: producto.stock,
        },
      ]);
    }

    setProductoSeleccionado('');
    setCantidad(1);
  };

  const quitarItem = (productoId) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  };

  const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Agrega al menos un producto a la venta');
      return;
    }

    try {
      await onGuardar({
        clienteId: clienteId || null,
        notas,
        items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      });
    } catch (err) {
      setError(err.message || 'Error al registrar la venta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.campo}>
        <label htmlFor="cliente">Cliente (opcional)</label>
        <select id="cliente" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Cliente ocasional</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className={styles.agregarItem}>
        <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)} className={styles.selectProducto}>
          <option value="">Selecciona un producto...</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id} disabled={p.stock === 0}>
              {p.nombre} — S/ {parseFloat(p.precio_venta).toFixed(2)} (stock: {p.stock})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
          className={styles.inputCantidad}
        />

        <button type="button" onClick={agregarItem} className={styles.botonAgregar}>
          Agregar
        </button>
      </div>

      {items.length > 0 && (
        <table className={styles.tablaItems}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.productoId}>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>S/ {i.precioUnitario.toFixed(2)}</td>
                <td>S/ {(i.precioUnitario * i.cantidad).toFixed(2)}</td>
                <td>
                  <button type="button" onClick={() => quitarItem(i.productoId)} className={styles.botonQuitar}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className={styles.totalLabel}>Total</td>
              <td colSpan="2" className={styles.totalValor}>S/ {total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className={styles.campo}>
        <label htmlFor="notas">Notas (opcional)</label>
        <textarea id="notas" rows="2" value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>

      <div className={styles.acciones}>
        <button type="button" onClick={onCancelar} className={styles.botonCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.botonGuardar} disabled={guardando || items.length === 0}>
          {guardando ? 'Registrando...' : 'Registrar venta'}
        </button>
      </div>
    </form>
  );
};

export default VentaForm;