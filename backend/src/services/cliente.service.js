const clienteRepository = require('../repositories/cliente.repository');

const crearCliente = async (datos) => {
  if (datos.email) {
    const existente = await clienteRepository.encontrarPorEmail(datos.email);
    if (existente) {
      const error = new Error('Ya existe un cliente con ese email');
      error.statusCode = 409;
      throw error;
    }
  }

  if (datos.documento) {
    const existente = await clienteRepository.encontrarPorDocumento(datos.documento);
    if (existente) {
      const error = new Error('Ya existe un cliente con ese documento');
      error.statusCode = 409;
      throw error;
    }
  }

  return clienteRepository.crear(datos);
};

const actualizarCliente = async (id, datos) => {
  const cliente = await clienteRepository.actualizar(id, datos);

  if (!cliente) {
    const error = new Error('Cliente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return cliente;
};

const eliminarCliente = async (id) => {
  const resultado = await clienteRepository.eliminar(id);

  if (!resultado) {
    const error = new Error('Cliente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return resultado;
};

const obtenerCliente = async (id) => {
  const cliente = await clienteRepository.encontrarPorId(id);

  if (!cliente) {
    const error = new Error('Cliente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return cliente;
};

const listarClientes = async ({ pagina, limite, busqueda }) => {
  const paginaNum = parseInt(pagina, 10) || 1;
  const limiteNum = parseInt(limite, 10) || 20;

  const { clientes, total } = await clienteRepository.listar({
    pagina: paginaNum,
    limite: limiteNum,
    busqueda,
  });

  return {
    clientes,
    paginacion: {
      pagina: paginaNum,
      limite: limiteNum,
      total,
      totalPaginas: Math.ceil(total / limiteNum),
    },
  };
};

const obtenerHistorialCompras = async (id) => {
  // Verifica que el cliente exista antes de buscar su historial
  await obtenerCliente(id);
  return clienteRepository.historialCompras(id);
};

module.exports = {
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerCliente,
  listarClientes,
  obtenerHistorialCompras,
};