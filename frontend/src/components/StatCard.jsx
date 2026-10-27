import styles from '../styles/StatCard.module.css';

const StatCard = ({ icono, etiqueta, valor, variacion, sufijoVariacion = 'vs ayer' }) => {
  const esPositivo = variacion >= 0;

  return (
    <div className={styles.card}>
      <div className={styles.icono}>{icono}</div>
      <div className={styles.info}>
        <span className={styles.etiqueta}>{etiqueta}</span>
        <span className={styles.valor}>{valor}</span>
        {variacion !== undefined && (
          <span className={esPositivo ? styles.variacionPositiva : styles.variacionNegativa}>
            {esPositivo ? '↑' : '↓'} {Math.abs(variacion)}% <span className={styles.sufijo}>{sufijoVariacion}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;