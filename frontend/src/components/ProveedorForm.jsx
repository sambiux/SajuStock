import { useState, useEffect } from 'react';
import styles from '../styles/ProductoForm.module.css';

const valoresIniciales = {
  nombre: '', email: '', telefono: '', direccion: '', notas: '',
};

const ProveedorForm = ({ proveedor, onGuardar, onCancelar, guardando }) => {
  const [form, setForm]   = useState(valoresIniciales);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(proveedor ? {
      nombre:    proveedor.nombre    || '',
      email:     proveedor.email     || '',
      telefono:  proveedor.telefono  || '',
      direccion: proveedor.direccion || '',
      notas:     proveedor.notas     || '',
    } : valoresIniciales);
  }, [proveedor]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onGuardar(form);
    } catch (err) {
      setError(err.message || 'Error al guardar el proveedor');
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
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@proveedor.com" />
        </div>

        <div className={styles.campo}>
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+57 300 000 0000" />
        </div>

        <div className={styles.campo}>
          <label htmlFor="direccion">Dirección</label>
          <input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="notas">Notas</label>
        <textarea id="notas" name="notas" rows="3" value={form.notas} onChange={handleChange} />
      </div>

      <div className={styles.acciones}>
        <button type="button" onClick={onCancelar} className={styles.botonCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.botonGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : proveedor ? 'Actualizar proveedor' : 'Crear proveedor'}
        </button>
      </div>
    </form>
  );
};

export default ProveedorForm;