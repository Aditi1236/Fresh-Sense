const mongoose = require('mongoose');

const tempPointSchema = new mongoose.Schema({
  time: String,
  temp: Number,
}, { _id: false });

const BatchSchema = new mongoose.Schema({
  batchId:      { type: String, required: true, unique: true },
  product:      { type: String, required: true },
  temperature:  { type: Number, default: 5 },
  humidity:     { type: Number, default: 80 },
  transitTime:  { type: Number, default: 12 },   // hours
  location:     { type: String, default: 'Unknown' },
  riskScore:    { type: Number, default: 0, min: 0, max: 100 },
  riskLevel:    { type: String, enum: ['SAFE', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'SAFE' },
  priority:     { type: String, enum: ['NORMAL', 'URGENT'], default: 'NORMAL' },
  tempHistory:  { type: [tempPointSchema], default: [] },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Batch', BatchSchema);
