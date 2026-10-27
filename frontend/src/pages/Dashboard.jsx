import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import styles from '../styles/Dashboard.module.css';

const formatearDia = (fechaISO) => {
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return dias[new Date(fechaISO).getUTCDay()];
};

const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const TooltipCustom = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span>S/ {payload[0].value.toFixed(2)}</span>
    </div>
  );
};

const Dashboard = () => {
  const { usuario } = useAuth();
  const { resumen, cargando, error } = useDashboard();

  if (cargando) return <p className={styles.estado}>Cargando...</p>;
  if (error)    return <p className={styles.estadoError}>{error}</p>;

  const datosGrafico = resumen.ventasSemana.map((d) => ({
    dia: formatearDia(d.fecha),
    total: d.total,
  }));

  const hayVentas = resumen.ultimasVentas.length > 0;

  return (
    <div className={styles.container}>

      {/* ── Saludo ── */}
      <div className={styles.saludo}>
        <h1 className={styles.titulo}>
          Hola, {usuario?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className={styles.subtitulo}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* ── Resumen ejecutivo ── */}
      <div className={styles.resumen}>
        <div className={styles.resumenItem}>
          <span className={styles.resumenValor}>
            S/ {resumen.ventasDelDia.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.resumenLabel}>Ventas hoy</span>
          {resumen.ventasDelDia.variacion !== 0 && (
            <span className={resumen.ventasDelDia.variacion > 0 ? styles.variacionPos : styles.variacionNeg}>
              {resumen.ventasDelDia.variacion > 0 ? '+' : ''}{resumen.ventasDelDia.variacion}% vs ayer
            </span>
          )}
        </div>

        <div className={styles.resumenDivider} />

        <div className={styles.resumenItem}>
          <span className={styles.resumenValor}>{resumen.productos.total}</span>
          <span className={styles.resumenLabel}>Productos activos</span>
        </div>

        <div className={styles.resumenDivider} />

        <div className={styles.resumenItem}>
          <span className={`${styles.resumenValor} ${resumen.stockBajo.total > 0 ? styles.valorAlerta : ''}`}>
            {resumen.stockBajo.total}
          </span>
          <span className={styles.resumenLabel}>Con stock bajo</span>
        </div>

        <div className={styles.resumenDivider} />

        <div className={styles.resumenItem}>
          <span className={styles.resumenValor}>{resumen.clientes.total}</span>
          <span className={styles.resumenLabel}>Clientes</span>
        </div>
      </div>

      {/* ── Gráfico ── */}
      <div className={styles.panelGrafico}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitulo}>Ventas — últimos 7 días</span>
        </div>

        {datosGrafico.every((d) => d.total === 0) ? (
          <p className={styles.sinDatos}>Sin ventas en los últimos 7 días.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={datosGrafico} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E85B2A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E85B2A" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="dia"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#bbb' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#bbb' }}
                tickFormatter={(v) => `S/ ${v}`}
                width={70}
              />
              <Tooltip content={<TooltipCustom />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#E85B2A"
                strokeWidth={2}
                fill="url(#gradVentas)"
                dot={{ r: 3, fill: '#E85B2A', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#E85B2A', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Últimas ventas ── */}
      <div className={styles.panelVentas}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitulo}>Últimas ventas</span>
        </div>

        {!hayVentas ? (
          <p className={styles.sinDatos}>No hay ventas registradas aún.</p>
        ) : (
          <div className={styles.listaVentas}>
            {resumen.ultimasVentas.map((v, i) => (
              <div key={v.id} className={styles.ventaItem}>
                <div className={styles.ventaIndex}>{i + 1}</div>
                <div className={styles.ventaInfo}>
                  <span className={styles.ventaCliente}>
                    {v.cliente_nombre || 'Cliente ocasional'}
                  </span>
                  <span className={styles.ventaFecha}>{formatearFecha(v.creado_en)}</span>
                </div>
                <span className={styles.ventaTotal}>
                  S/ {v.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;