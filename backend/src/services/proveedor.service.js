const proveedorRepository = require('../repositories/proveedor.repository');

const crearProveedor = async (datos) => {
  if (datos.email) {
    const existente = await proveedorRepository.encontrarPorEmail(datos.email);
    if (existente) {
      const error = new Error('Ya existe un proveedor con ese email');
      error.statusCode = 409;
      throw error;
    }
  }

  return proveedorRepository.crear(datos);
};

const actualizarProveedor = async (id, datos) => {
  const proveedor = await proveedorRepository.actualizar(id, datos);

  if (!proveedor) {
    const error = new Error('Proveedor no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return proveedor;
};

const eliminarProveedor = async (id) => {
  const resultado = await proveedorRepository.eliminar(id);

  if (!resultado) {
    const error = new Error('Proveedor no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return resultado;
};

const obtenerProveedor = async (id) => {
  const proveedor = await proveedorRepository.encontrarPorId(id);

  if (!proveedor) {
    const error = new Error('Proveedor no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return proveedor;
};

const listarProveedores = async ({ pagina, limite, busqueda }) => {
  const paginaNum = parseInt(pagina, 10) || 1;
  const limiteNum = parseInt(limite, 10) || 20;

  const { proveedores, total } = await proveedorRepository.listar({
    pagina: paginaNum,
    limite: limiteNum,
    busqueda,
  });

  return {
    proveedores,
    paginacion: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
};

module.exports = {
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProveedor,
  listarProveedores,
};