const { calculateRisk } = require('../services/riskEngine');

// Demo batches — MongoDB is not required
let demoBatches = [
  {
    batchId: 'B001',
    product: 'Apple',
    temperature: 4.2,
    humidity: 82,
    transitTime: 12,
    location: 'Punjab',
    riskScore: 18,
    riskLevel: 'SAFE',
    priority: 'NORMAL',
    tempHistory: [
      { time: '08:00', temperature: 3.8 },
      { time: '10:00', temperature: 4.0 },
      { time: '12:00', temperature: 4.2 },
      { time: '14:00', temperature: 4.2 }
    ]
  },

  {
    batchId: 'B002',
    product: 'Strawberry',
    temperature: 8.4,
    humidity: 91,
    transitTime: 18,
    location: 'Chandigarh',
    riskScore: 78,
    riskLevel: 'HIGH',
    priority: 'URGENT',
    tempHistory: [
      { time: '08:00', temperature: 5.0 },
      { time: '10:00', temperature: 5.8 },
      { time: '12:00', temperature: 6.7 },
      { time: '14:00', temperature: 7.5 },
      { time: '16:00', temperature: 8.4 }
    ]
  },

  {
    batchId: 'B003',
    product: 'Milk',
    temperature: 3.8,
    humidity: 75,
    transitTime: 8,
    location: 'Ludhiana',
    riskScore: 24,
    riskLevel: 'SAFE',
    priority: 'NORMAL',
    tempHistory: [
      { time: '08:00', temperature: 3.5 },
      { time: '10:00', temperature: 3.6 },
      { time: '12:00', temperature: 3.7 },
      { time: '14:00', temperature: 3.8 }
    ]
  },

  {
    batchId: 'B004',
    product: 'Tomato',
    temperature: 6.7,
    humidity: 86,
    transitTime: 15,
    location: 'Amritsar',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    priority: 'NORMAL',
    tempHistory: [
      { time: '08:00', temperature: 5.0 },
      { time: '10:00', temperature: 5.5 },
      { time: '12:00', temperature: 6.0 },
      { time: '14:00', temperature: 6.7 }
    ]
  },

  {
    batchId: 'B005',
    product: 'Mango',
    temperature: 7.9,
    humidity: 89,
    transitTime: 20,
    location: 'Delhi',
    riskScore: 68,
    riskLevel: 'HIGH',
    priority: 'URGENT',
    tempHistory: [
      { time: '08:00', temperature: 5.2 },
      { time: '10:00', temperature: 6.0 },
      { time: '12:00', temperature: 6.8 },
      { time: '14:00', temperature: 7.4 },
      { time: '16:00', temperature: 7.9 }
    ]
  }
];


// GET /api/batches
const getAllBatches = async (req, res, next) => {
  try {
    res.json(demoBatches);
  } catch (err) {
    next(err);
  }
};


// POST /api/batches
const createBatch = async (req, res, next) => {
  try {
    const {
      product,
      temperature,
      humidity,
      transitTime,
      location,
      batchId
    } = req.body;

    const risk = calculateRisk({
      product,
      temperature,
      humidity,
      transitTime
    });

    const newBatch = {
      batchId: batchId || `B${Date.now()}`,
      product: product || 'Unknown',
      temperature: temperature || 0,
      humidity: humidity || 0,
      transitTime: transitTime || 0,
      location: location || 'Unknown',
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      priority: risk.riskScore >= 61 ? 'URGENT' : 'NORMAL',
      tempHistory: []
    };

    demoBatches.push(newBatch);

    res.status(201).json(newBatch);
  } catch (err) {
    next(err);
  }
};


// GET /api/batches/:batchId
const getBatchById = async (req, res, next) => {
  try {
    const batch = demoBatches.find(
      (b) => b.batchId === req.params.batchId
    );

    if (!batch) {
      return res.status(404).json({
        error: 'Batch not found'
      });
    }

    res.json(batch);
  } catch (err) {
    next(err);
  }
};


// PUT /api/batches/:batchId
const updateBatch = async (req, res, next) => {
  try {
    const index = demoBatches.findIndex(
      (b) => b.batchId === req.params.batchId
    );

    if (index === -1) {
      return res.status(404).json({
        error: 'Batch not found'
      });
    }

    demoBatches[index] = {
      ...demoBatches[index],
      ...req.body
    };

    res.json(demoBatches[index]);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllBatches,
  createBatch,
  getBatchById,
  updateBatch
};
