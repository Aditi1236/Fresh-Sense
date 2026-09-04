const Alert = require('../models/Alert');

// GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAlerts };
