import { useState, useEffect } from 'react';
import styles from '../styles/ProductoForm.module.css';

const valoresIniciales = {
  nombre: '',
  descripcion: '',
  codigo: '',
  precioVenta: '',
  precioCompra: '',
  stock: '',
  stockMinimo: '',
  categoriaId: '',
};

const ProductoForm = ({ producto, categorias, onGuardar, onCancelar, guardando }) => {
  const [form, setForm] = useState(valoresIniciales);
  const [error, setError] = useState('');

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        codigo: producto.codigo || '',
        precioVenta: producto.precio_venta ?? '',
        precioCompra: producto.precio_compra ?? '',
        stock: producto.stock ?? '',
        stockMinimo: producto.stock_minimo ?? '',
        categoriaId: producto.categoria_id ?? '',
      });
    } else {
      setForm(valoresIniciales);
    }
  }, [producto]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onGuardar({
        ...form,
        precioVenta: parseFloat(form.precioVenta),
        precioCompra: form.precioCompra ? parseFloat(form.precioCompra) : null,
        stock: form.stock ? parseInt(form.stock, 10) : 0,
        stockMinimo: form.stockMinimo ? parseInt(form.stockMinimo, 10) : 5,
        categoriaId: form.categoriaId ? parseInt(form.categoriaId, 10) : null,
      });
    } catch (err) {
      setError(err.message || 'Error al guardar el producto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        <div className={styles.campo}>
          <label htmlFor="nombre">Nombre *</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className={styles.campo}>
          <label htmlFor="codigo">Código</label>
          <input id="codigo" name="codigo" value={form.codigo} onChange={handleChange} placeholder="SKU-001" />
        </div>

        <div className={styles.campo}>
          <label htmlFor="categoriaId">Categoría</label>
          <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
            <option value="">Sin categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="precioVenta">Precio de venta *</label>
          <input
            id="precioVenta" name="precioVenta" type="number" step="0.01" min="0"
            value={form.precioVenta} onChange={handleChange} required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="precioCompra">Precio de compra</label>
          <input
            id="precioCompra" name="precioCompra" type="number" step="0.01" min="0"
            value={form.precioCompra} onChange={handleChange}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="stock">Stock inicial</label>
          <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
        </div>

        <div className={styles.campo}>
          <label htmlFor="stockMinimo">Stock mínimo</label>
          <input id="stockMinimo" name="stockMinimo" type="number" min="0" value={form.stockMinimo} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" rows="3" value={form.descripcion} onChange={handleChange} />
      </div>

      <div className={styles.acciones}>
        <button type="button" onClick={onCancelar} className={styles.botonCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.botonGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : producto ? 'Actualizar producto' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;