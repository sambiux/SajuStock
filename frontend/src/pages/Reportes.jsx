import { useState, useEffect, useCallback } from 'react';
import { reporteService } from '../services/reporte.service';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, AreaChart, Area,
} from 'recharts';
import styles from '../styles/Reportes.module.css';

const hoy = () => new Date().toISOString().split('T')[0];
const hace30 = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
};

const TABS = [
  { id: 'resumen',   label: 'Resumen inventario' },
  { id: 'vendidos',  label: 'Más vendidos'        },
  { id: 'fechas',    label: 'Ventas por fecha'    },
  { id: 'clientes',  label: 'Ventas por cliente'  },
  { id: 'stock',     label: 'Stock bajo'          },
];

const Reportes = () => {
  const [tabActiva, setTabActiva]     = useState('resumen');
  const [fechaDesde, setFechaDesde]   = useState(hace30());
  const [fechaHasta, setFechaHasta]   = useState(hoy());
  const [datos, setDatos]             = useState(null);
  const [cargando, setCargando]       = useState(false);
  const [error, setError]             = useState('');

  const cargar = useCallback(async (tab = tabActiva) => {
    setCargando(true);
    setError('');
    setDatos(null);   // limpia siempre antes de pedir

    const filtros = { fechaDesde, fechaHasta };

    try {
      let resultado = null;

      if (tab === 'resumen')  resultado = await reporteService.resumenInventario();
      if (tab === 'vendidos') resultado = await reporteService.productosMasVendidos(filtros);
      if (tab === 'fechas')   resultado = await reporteService.ventasPorFecha(filtros);
      if (tab === 'clientes') resultado = await reporteService.ventasPorCliente(filtros);
      if (tab === 'stock')    resultado = await reporteService.productosStockBajo();

      setDatos(resultado);
    } catch (err) {
      setError(err.message || 'Error al cargar el reporte');
    } finally {
      setCargando(false);
    }
  }, [tabActiva, fechaDesde, fechaHasta]);

  useEffect(() => {
    cargar(tabActiva);
  }, [tabActiva]);   // solo recarga cuando cambia el tab

  const handleCambiarTab = (id) => {
    setTabActiva(id);   // el useEffect de arriba lo recarga
  };

  const necesitaFechas = ['vendidos', 'fechas', 'clientes'].includes(tabActiva);

  // helpers para saber qué tipo tiene datos actualmente
  const datosEsArray  = Array.isArray(datos);
  const datosEsObjeto = datos && !Array.isArray(datos);

  return (
    <div className={styles.container}>
      <div className={styles.encabezado}>
        <h1>Reportes</h1>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleCambiarTab(t.id)}
            className={tabActiva === t.id ? `${styles.tab} ${styles.tabActiva}` : styles.tab}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filtro de fechas */}
      {necesitaFechas && (
        <div className={styles.filtros}>
          <div className={styles.campofecha}>
            <label>Desde</label>
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          </div>
          <div className={styles.campofecha}>
            <label>Hasta</label>
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </div>
          <button onClick={() => cargar(tabActiva)} className={styles.botonFiltrar}>Aplicar</button>
        </div>
      )}

      {error    && <p className={styles.error}>{error}</p>}
      {cargando && <p className={styles.cargando}>Cargando reporte...</p>}

      {!cargando && datos !== null && (
        <div className={styles.contenido}>

          {/* ── Resumen inventario ── */}
          {tabActiva === 'resumen' && datosEsObjeto && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total productos</span>
                <span className={styles.statValor}>{datos.total_productos}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total unidades</span>
                <span className={styles.statValor}>{datos.total_unidades}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Valor a precio venta</span>
                <span className={styles.statValor}>S/ {parseFloat(datos.valor_venta || 0).toFixed(2)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Valor a costo</span>
                <span className={styles.statValor}>S/ {parseFloat(datos.valor_costo || 0).toFixed(2)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Productos stock bajo</span>
                <span className={`${styles.statValor} ${styles.alerta}`}>{datos.productos_stock_bajo}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Productos agotados</span>
                <span className={`${styles.statValor} ${styles.alerta}`}>{datos.productos_agotados}</span>
              </div>
            </div>
          )}

          {/* ── Productos más vendidos ── */}
          {tabActiva === 'vendidos' && datosEsArray && (
            datos.length === 0 ? (
              <p className={styles.vacio}>Sin datos para el período seleccionado.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#999' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} />
                    <Tooltip formatter={(v) => [v, 'Unidades vendidas']} contentStyle={{ borderRadius: 8, fontSize: '0.85rem' }} />
                    <Bar dataKey="total_vendido" fill="#E85B2A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <table className={styles.tabla}>
                  <thead>
                    <tr>
                      <th>#</th><th>Producto</th><th>Código</th>
                      <th>Unidades vendidas</th><th>Ingresos</th><th>Veces vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.nombre}</td>
                        <td>{p.codigo || '—'}</td>
                        <td>{p.total_vendido}</td>
                        <td>S/ {parseFloat(p.total_ingresos).toFixed(2)}</td>
                        <td>{p.veces_vendido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )
          )}

          {/* ── Ventas por fecha ── */}
          {tabActiva === 'fechas' && datosEsArray && (
            datos.length === 0 ? (
              <p className={styles.vacio}>Sin ventas para el período seleccionado.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datos}>
                    <defs>
                      <linearGradient id="gradFecha" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#E85B2A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E85B2A" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#999' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `S/ ${v}`} />
                    <Tooltip formatter={(v) => [`S/ ${parseFloat(v).toFixed(2)}`, 'Ingresos']} contentStyle={{ borderRadius: 8, fontSize: '0.85rem' }} />
                    <Area type="monotone" dataKey="total_ingresos" stroke="#E85B2A" strokeWidth={2} fill="url(#gradFecha)" />
                  </AreaChart>
                </ResponsiveContainer>
                <table className={styles.tabla}>
                  <thead>
                    <tr>
                      <th>Fecha</th><th>Cantidad ventas</th>
                      <th>Total ingresos</th><th>Ticket promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.map((d) => (
                      <tr key={d.fecha}>
                        <td>{new Date(d.fecha).toLocaleDateString('es-CO')}</td>
                        <td>{d.cantidad_ventas}</td>
                        <td>S/ {parseFloat(d.total_ingresos).toFixed(2)}</td>
                        <td>S/ {parseFloat(d.ticket_promedio).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )
          )}

          {/* ── Ventas por cliente ── */}
          {tabActiva === 'clientes' && datosEsArray && (
            datos.length === 0 ? (
              <p className={styles.vacio}>Sin datos para el período seleccionado.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#999' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#999' }} tickFormatter={(v) => `S/ ${v}`} />
                    <Tooltip formatter={(v) => [`S/ ${parseFloat(v).toFixed(2)}`, 'Total gastado']} contentStyle={{ borderRadius: 8, fontSize: '0.85rem' }} />
                    <Bar dataKey="total_gastado" fill="#E85B2A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <table className={styles.tabla}>
                  <thead>
                    <tr>
                      <th>#</th><th>Cliente</th><th>Email</th>
                      <th>Compras</th><th>Total gastado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.map((c, i) => (
                      <tr key={c.id}>
                        <td>{i + 1}</td>
                        <td>{c.nombre}</td>
                        <td>{c.email || '—'}</td>
                        <td>{c.cantidad_compras}</td>
                        <td>S/ {parseFloat(c.total_gastado).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )
          )}

          {/* ── Stock bajo ── */}
          {tabActiva === 'stock' && datosEsArray && (
            datos.length === 0 ? (
              <p className={styles.vacio}>Todos los productos tienen stock suficiente. </p>
            ) : (
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th>Producto</th><th>Código</th><th>Categoría</th>
                    <th>Stock actual</th><th>Stock mínimo</th><th>Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.codigo || '—'}</td>
                      <td>{p.categoria_nombre || '—'}</td>
                      <td className={p.stock === 0 ? styles.agotado : styles.stockBajo}>{p.stock}</td>
                      <td>{p.stock_minimo}</td>
                      <td className={styles.agotado}>{p.stock - p.stock_minimo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

        </div>
      )}
    </div>
  );
};

export default Reportes;