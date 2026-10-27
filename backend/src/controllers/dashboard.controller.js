const dashboardService = require('../services/dashboard.service');

const resumen = async (req, res, next) => {
  try {
    const datos = await dashboardService.obtenerResumen();
    return res.status(200).json(datos);
  } catch (error) {
    next(error);
  }
};

module.exports = { resumen };