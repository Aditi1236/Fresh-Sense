const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  batchId:   { type: String, required: true },
  product:   { type: String, required: true },
  type:      { type: String, enum: ['HIGH_TEMP', 'HIGH_HUMIDITY', 'HIGH_RISK'], required: true },
  message:   { type: String, required: true },
  severity:  { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', AlertSchema);
