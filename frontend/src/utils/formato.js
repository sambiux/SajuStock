const conMiles = (numero) =>
  Math.round(numero).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatearNumero = (valor) => conMiles(Number(valor) || 0);
export const formatearMoneda = (valor) => `${formatearNumero(valor)} COP`;