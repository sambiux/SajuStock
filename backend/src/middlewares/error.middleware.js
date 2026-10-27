const manejarErrores = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Error de base de datos: violación de unicidad
  if (err.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }

  // Error de base de datos: violación de llave foránea
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referencia a un registro que no existe' });
  }

  // Error de base de datos: violación de restricción NOT NULL
  if (err.code === '23502') {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Error genérico del servidor
  return res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = manejarErrores;
