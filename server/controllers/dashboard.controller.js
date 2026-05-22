const { asyncHandler, sendSuccess } = require('../utils/response');
const { getDashboard } = require('../services/dashboard.service');

const dashboard = asyncHandler(async (req, res) => {
  const data = await getDashboard(req.user.id, req.user.role);
  sendSuccess(res, data, 'Dashboard data retrieved');
});

module.exports = { dashboard };
