const Batch = require('../models/Batch');
const Alert = require('../models/Alert');

// Hardcoded simulation steps for B002 Strawberry (demo-critical path)
const B002_STEPS = [
  { step: 1, temperature: 5.0,  riskScore: 18, riskLevel: 'SAFE'   },
  { step: 2, temperature: 6.5,  riskScore: 35, riskLevel: 'MEDIUM' },
  { step: 3, temperature: 8.0,  riskScore: 52, riskLevel: 'MEDIUM' },
  { step: 4, temperature: 9.2,  riskScore: 67, riskLevel: 'HIGH'   },
  { step: 5, temperature: 10.0, riskScore: 84, riskLevel: 'HIGH'   },
];

// POST /api/simulate
const simulate = async (req, res, next) => {
  try {
    const { batchId, step } = req.body;
    if (!batchId || step === undefined) {
      return res.status(400).json({ error: 'batchId and step are required' });
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    let newTemp, newRisk, newLevel;

    if (batchId === 'B002') {
      const simStep = B002_STEPS.find((s) => s.step === Number(step));
      if (!simStep) return res.status(400).json({ error: `Invalid step ${step} for B002` });
      newTemp  = simStep.temperature;
      newRisk  = simStep.riskScore;
      newLevel = simStep.riskLevel;
    } else {
      // Generic: linearly ramp temp from current by +1.5°C per step
      newTemp  = parseFloat((batch.temperature + 1.5 * step).toFixed(1));
      // Simple risk estimate
      newRisk  = Math.min(batch.riskScore + step * 12, 100);
      newLevel = newRisk <= 30 ? 'SAFE' : newRisk <= 60 ? 'MEDIUM' : newRisk <= 85 ? 'HIGH' : 'CRITICAL';
    }

    // Build time label
    const timeLabel = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Push to temp history
    const updatedBatch = await Batch.findOneAndUpdate(
      { batchId },
      {
        $set:  { temperature: newTemp, riskScore: newRisk, riskLevel: newLevel },
        $push: { tempHistory: { time: timeLabel, temp: newTemp } },
      },
      { new: true }
    );

    // Create HIGH_RISK alert if threshold crossed
    let alert = null;
    if (newRisk > 60) {
      // Upsert alert so we don't duplicate
      alert = await Alert.findOneAndUpdate(
        { batchId, type: 'HIGH_RISK' },
        {
          $set: {
            product:  batch.product,
            message:  `🚨 HIGH SPOILAGE RISK DETECTED — Batch ${batchId}, Risk ${newRisk}%, check refrigeration & prioritize delivery`,
            severity: newRisk > 85 ? 'CRITICAL' : 'HIGH',
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      batchId,
      step:        Number(step),
      temperature: newTemp,
      riskScore:   newRisk,
      riskLevel:   newLevel,
      humidity:    updatedBatch.humidity,
      transitTime: updatedBatch.transitTime,
      product:     updatedBatch.product,
      alert:       alert
        ? { message: alert.message, severity: alert.severity }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { simulate };
