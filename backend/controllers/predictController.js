const { calculateRisk, getRiskReason } = require('../services/riskEngine');
const { getPrediction } = require('../services/mlClient');

// POST /api/predict
const predict = async (req, res, next) => {
  try {
    const { product, temperature, humidity, transitTime } = req.body;

    // Try ML service first
    let result;
    let source = 'engine';
    try {
      result = await getPrediction({ product, temperature, humidity, transitTime });
      source = 'ml';
    } catch {
      // ML unavailable — fall back to rule engine
      result = calculateRisk({ product, temperature, humidity, transitTime });
    }

    const reason = getRiskReason({
      product,
      temperature,
      humidity,
      transitTime,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
    });

    res.json({ ...result, reason, source });
  } catch (err) {
    next(err);
  }
};

module.exports = { predict };
