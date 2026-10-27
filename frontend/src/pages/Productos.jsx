import { useState, useEffect, useCallback } from 'react';
import { useProductos } from '../hooks/useProductos';
import { productoService } from '../services/producto.service';
import { categoriaService } from '../services/categoria.service';
import { useAuth } from '../context/AuthContext';
import ProductoForm from '../components/ProductoForm';
import styles from '../styles/PaginaTabla.module.css';
import estilos from '../styles/Productos.module.css';

const Productos = () => {
  const { productos, paginacion, cargando, error, recargar } = useProductos();
  const { esAdmin } = useAuth();
  const [categorias, setCategorias]             = useState([]);
  const [busqueda, setBusqueda]                 = useState('');
  const [categoriaFiltro, setCategoriaFiltro]   = useState('');
  const [modalProducto, setModalProducto]       = useState(false);
  const [modalCategoria, setModalCategoria]     = useState(false);
  const [productoEditar, setProductoEditar]     = useState(null);
  const [guardando, setGuardando]               = useState(false);
  const [guardandoCat, setGuardandoCat]         = useState(false);
  const [nuevaCategoria, setNuevaCategoria]     = useState({ nombre: '', descripcion: '' });
  const [errorCategoria, setErrorCategoria]     = useState('');
  const [exitoCategoria, setExitoCategoria]     = useState('');

  const cargarCategorias = useCallback(async () => {
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch {}
  }, []);

  useEffect(() => { cargarCategorias(); }, [cargarCategorias]);

  const handleBuscar = useCallback((e) => {
    e?.preventDefault();
    recargar({ pagina: 1, busqueda, categoriaId: categoriaFiltro });
  }, [busqueda, categoriaFiltro, recargar]);

  // Recarga cuando cambia el filtro de categoría directamente
  const handleCambiarCategoria = (e) => {
    const val = e.target.value;
    setCategoriaFiltro(val);
    recargar({ pagina: 1, busqueda, categoriaId: val });
  };

  const abrirCrear  = () => { setProductoEditar(null); setModalProducto(true); };
  const abrirEditar = (p) => { setProductoEditar(p);   setModalProducto(true); };
  const cerrarModal = () => { setModalProducto(false); setProductoEditar(null); };

  const handleGuardar = async (datos) => {
    setGuardando(true);
    try {
      if (productoEditar) {
        await productoService.actualizar(productoEditar.id, datos);
      } else {
        await productoService.crear(datos);
      }
      cerrarModal();
      recargar({ pagina: paginacion.pagina, busqueda, categoriaId: categoriaFiltro });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;
    try {
      await productoService.eliminar(producto.id);
      recargar({ pagina: paginacion.pagina, busqueda, categoriaId: categoriaFiltro });
    } catch (err) {
      alert(err.message || 'Error al eliminar el producto');
    }
  };

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    setErrorCategoria('');
    setGuardandoCat(true);
    try {
      await categoriaService.crear(nuevaCategoria.nombre, nuevaCategoria.descripcion);
      setExitoCategoria(`Categoría "${nuevaCategoria.nombre}" creada correctamente`);
      setNuevaCategoria({ nombre: '', descripcion: '' });
      cargarCategorias();
      setTimeout(() => {
        setExitoCategoria('');
        setModalCategoria(false);
      }, 1500);
    } catch (err) {
      setErrorCategoria(err.message || 'Error al crear la categoría');
    } finally {
      setGuardandoCat(false);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    recargar({ pagina: nuevaPagina, busqueda, categoriaId: categoriaFiltro });
  };

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Productos</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setModalCategoria(true)} className={estilos.botonCategorias}>
            + Nueva categoría
          </button>
          <button onClick={abrirCrear} className={styles.botonNuevo}>
            + Nuevo producto
          </button>
        </div>
      </div>

      <form onSubmit={handleBuscar} className={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.inputBusqueda}
        />
        <select
          value={categoriaFiltro}
          onChange={handleCambiarCategoria}
          className={styles.selectFiltro}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <button type="submit" className={styles.botonFiltrar}>Filtrar</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {cargando ? (
        <p className={styles.cargando}>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className={styles.vacio}>No se encontraron productos.</p>
      ) : (
        <>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.codigo || '—'}</td>
                  <td>{p.categoria_nombre || '—'}</td>
                  <td>S/ {parseFloat(p.precio_venta).toFixed(2)}</td>
                  <td>
                    <span className={p.stock <= p.stock_minimo ? styles.stockBajo : styles.stockOk}>
                      {p.stock}
                    </span>
                  </td>
                  <td className={styles.acciones}>
                    <button onClick={() => abrirEditar(p)} className={styles.botonEditar}>Editar</button>
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

      {/* Modal nuevo producto */}
      {modalProducto && (
        <div className={styles.overlay} onClick={cerrarModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{productoEditar ? 'Editar producto' : 'Nuevo producto'}</h2>
            <ProductoForm
              producto={productoEditar}
              categorias={categorias}
              onGuardar={handleGuardar}
              onCancelar={cerrarModal}
              guardando={guardando}
            />
          </div>
        </div>
      )}

      {/* Modal nueva categoría */}
      {modalCategoria && (
        <div className={styles.overlay} onClick={() => setModalCategoria(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Nueva categoría</h2>

            {errorCategoria && <p className={styles.error}>{errorCategoria}</p>}
            {exitoCategoria && (
              <p style={{ background: '#dcfce7', borderLeft: '3px solid #16a34a', color: '#15803d', padding: '0.625rem 0.875rem', borderRadius: 4, fontSize: '0.875rem', marginBottom: '1rem' }}>
                {exitoCategoria}
              </p>
            )}

            <form onSubmit={handleCrearCategoria} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>Nombre *</label>
                <input
                  value={nuevaCategoria.nombre}
                  onChange={(e) => setNuevaCategoria((p) => ({ ...p, nombre: e.target.value }))}
                  required
                  style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '0.625rem 0.75rem', fontSize: '0.875rem', outline: 'none' }}
                  placeholder="Ej: Ropa deportiva"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>Descripción (opcional)</label>
                <textarea
                  value={nuevaCategoria.descripcion}
                  onChange={(e) => setNuevaCategoria((p) => ({ ...p, descripcion: e.target.value }))}
                  rows="2"
                  style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '0.625rem 0.75rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalCategoria(false)}
                  disabled={guardandoCat}
                  style={{ background: '#f0f0f0', color: '#1a1a1a', border: 'none', borderRadius: 6, padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoCat}
                  style={{ background: '#E85B2A', color: '#fff', border: 'none', borderRadius: 6, padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {guardandoCat ? 'Creando...' : 'Crear categoría'}
                </button>
              </div>
            </form>

            {/* Lista de categorías existentes */}
            {categorias.length > 0 && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>
                  Categorías existentes ({categorias.length})
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categorias.map((cat) => (
                    <span
                      key={cat.id}
                      style={{ background: '#fde8df', color: '#E85B2A', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500 }}
                    >
                      {cat.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;