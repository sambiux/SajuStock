import { useState, useEffect } from 'react';
import styles from '../styles/ProductoForm.module.css';

const valoresIniciales = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  documento: '',
};

const ClienteForm = ({ cliente, onGuardar, onCancelar, guardando }) => {
  const [form, setForm] = useState(valoresIniciales);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        documento: cliente.documento || '',
      });
    } else {
      setForm(valoresIniciales);
    }
  }, [cliente]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onGuardar(form);
    } catch (err) {
      setError(err.message || 'Error al guardar el cliente');
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
          <label htmlFor="documento">Documento</label>
          <input id="documento" name="documento" value={form.documento} onChange={handleChange} placeholder="DNI / NIT / RUC" />
        </div>

        <div className={styles.campo}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
        </div>

        <div className={styles.campo}>
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+57 300 000 0000" />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="direccion">Dirección</label>
        <textarea id="direccion" name="direccion" rows="2" value={form.direccion} onChange={handleChange} />
      </div>

      <div className={styles.acciones}>
        <button type="button" onClick={onCancelar} className={styles.botonCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.botonGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : cliente ? 'Actualizar cliente' : 'Crear cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;