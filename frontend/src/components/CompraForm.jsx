import { useState, useEffect } from 'react';
import { productoService } from '../services/producto.service';
import styles from '../styles/VentaForm.module.css';

const CompraForm = ({ onGuardar, onCancelar, guardando }) => {
  const [productos, setProductos] = useState([]);
  const [proveedor, setProveedor] = useState('');
  const [notas, setNotas] = useState('');
  const [items, setItems] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    productoService.listar({ limite: 100 }).then((r) => setProductos(r.productos)).catch(() => {});
  }, []);

  const agregarItem = () => {
    setError('');

    if (!productoSeleccionado) {
      setError('Selecciona un producto');
      return;
    }

    if (cantidad < 1) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (!precioUnitario || parseFloat(precioUnitario) < 0) {
      setError('Ingresa un precio de compra válido');
      return;
    }

    const producto = productos.find((p) => p.id === parseInt(productoSeleccionado, 10));
    if (!producto) return;

    const existente = items.find((i) => i.productoId === producto.id);

    if (existente) {
      setItems((prev) =>
        prev.map((i) =>
          i.productoId === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad,
          precioUnitario: parseFloat(precioUnitario),
        },
      ]);
    }

    setProductoSeleccionado('');
    setCantidad(1);
    setPrecioUnitario('');
  };

  const quitarItem = (productoId) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  };

  const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Agrega al menos un producto a la compra');
      return;
    }

    try {
      await onGuardar({
        proveedor,
        notas,
        items: items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
      });
    } catch (err) {
      setError(err.message || 'Error al registrar la compra');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.campo}>
        <label htmlFor="proveedor">Proveedor (opcional)</label>
        <input
          id="proveedor"
          type="text"
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value)}
          placeholder="Nombre del proveedor"
          style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '0.625rem 0.75rem', fontSize: '0.875rem' }}
        />
      </div>

      <div className={styles.agregarItem}>
        <select
          value={productoSeleccionado}
          onChange={(e) => {
            setProductoSeleccionado(e.target.value);
            const p = productos.find((p) => p.id === parseInt(e.target.value, 10));
            if (p && p.precio_compra) setPrecioUnitario(p.precio_compra);
          }}
          className={styles.selectProducto}
        >
          <option value="">Selecciona un producto...</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (stock actual: {p.stock})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Cant."
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
          className={styles.inputCantidad}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          className={styles.inputCantidad}
          style={{ width: 100 }}
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
              <th>Precio compra</th>
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
        <textarea id="notas" rows="2" value={notas} onChange={(e) => setNotas(e.target.value)}
          style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '0.625rem 0.75rem', fontSize: '0.875rem' }}
        />
      </div>

      <div className={styles.acciones}>
        <button type="button" onClick={onCancelar} className={styles.botonCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.botonGuardar} disabled={guardando || items.length === 0}>
          {guardando ? 'Registrando...' : 'Registrar compra'}
        </button>
      </div>
    </form>
  );
};

export default CompraForm;