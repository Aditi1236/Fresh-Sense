const Batch = require('../models/Batch');
const { calculateRisk } = require('../services/riskEngine');

// GET /api/batches
const getAllBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    next(err);
  }
};

// POST /api/batches
const createBatch = async (req, res, next) => {
  try {
    const { product, temperature, humidity, transitTime, location, batchId } = req.body;
    const risk = calculateRisk({ product, temperature, humidity, transitTime });
    const batch = new Batch({
      batchId: batchId || `B${Date.now()}`,
      product,
      temperature,
      humidity,
      transitTime,
      location: location || 'Unknown',
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
    });
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    next(err);
  }
};

// GET /api/batches/:batchId
const getBatchById = async (req, res, next) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    next(err);
  }
};

// PUT /api/batches/:batchId
const updateBatch = async (req, res, next) => {
  try {
    const batch = await Batch.findOneAndUpdate(
      { batchId: req.params.batchId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBatches, createBatch, getBatchById, updateBatch };
