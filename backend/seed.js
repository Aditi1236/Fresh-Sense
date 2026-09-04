/**
 * Seed script — populates MongoDB with demo batches and alerts.
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const Batch = require('./models/Batch');
const Alert = require('./models/Alert');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/freshsense';

const batches = [
  {
    batchId: 'B001',
    product: 'Milk',
    temperature: 4.2,
    humidity: 75,
    transitTime: 6,
    location: 'Ludhiana Cold Storage',
    riskScore: 22,
    riskLevel: 'SAFE',
    priority: 'NORMAL',
    tempHistory: [
      { time: '09:00', temp: 3.8 },
      { time: '10:00', temp: 4.0 },
      { time: '11:00', temp: 4.1 },
      { time: '12:00', temp: 4.2 },
    ],
  },
  {
    batchId: 'B002',
    product: 'Strawberry',
    temperature: 5.0,
    humidity: 91,
    transitTime: 18,
    location: 'Farm – Ludhiana',
    riskScore: 18,
    riskLevel: 'SAFE',
    priority: 'NORMAL',
    tempHistory: [
      { time: '09:00', temp: 3.2 },
      { time: '10:00', temp: 3.8 },
      { time: '11:00', temp: 4.5 },
      { time: '12:00', temp: 5.0 },
    ],
  },
  {
    batchId: 'B003',
    product: 'Spinach',
    temperature: 7.1,
    humidity: 88,
    transitTime: 12,
    location: 'Truck – NH1 Highway',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    priority: 'NORMAL',
    tempHistory: [
      { time: '09:00', temp: 4.0 },
      { time: '10:00', temp: 5.2 },
      { time: '11:00', temp: 6.4 },
      { time: '12:00', temp: 7.1 },
    ],
  },
  {
    batchId: 'B004',
    product: 'Mango',
    temperature: 12.3,
    humidity: 82,
    transitTime: 24,
    location: 'Chandigarh Distribution',
    riskScore: 72,
    riskLevel: 'HIGH',
    priority: 'NORMAL',
    tempHistory: [
      { time: '09:00', temp: 10.0 },
      { time: '10:00', temp: 10.8 },
      { time: '11:00', temp: 11.5 },
      { time: '12:00', temp: 12.3 },
    ],
  },
  {
    batchId: 'B005',
    product: 'Fish',
    temperature: 5.8,
    humidity: 79,
    transitTime: 9,
    location: 'Ludhiana Market',
    riskScore: 31,
    riskLevel: 'MEDIUM',
    priority: 'NORMAL',
    tempHistory: [
      { time: '09:00', temp: 2.5 },
      { time: '10:00', temp: 3.8 },
      { time: '11:00', temp: 4.9 },
      { time: '12:00', temp: 5.8 },
    ],
  },
];

const alerts = [
  {
    batchId: 'B002',
    product: 'Strawberry',
    type: 'HIGH_TEMP',
    message: 'Temperature rising above safe range for Strawberry batch B002',
    severity: 'HIGH',
  },
  {
    batchId: 'B003',
    product: 'Spinach',
    type: 'HIGH_HUMIDITY',
    message: 'Humidity at 88% exceeds optimal range for Spinach batch B003',
    severity: 'MEDIUM',
  },
  {
    batchId: 'B002',
    product: 'Strawberry',
    type: 'HIGH_RISK',
    message: '🚨 HIGH SPOILAGE RISK DETECTED — Batch B002, Risk 78%, check refrigeration & prioritize delivery',
    severity: 'HIGH',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Batch.deleteMany({});
  await Alert.deleteMany({});
  console.log('🗑  Cleared existing data');

  await Batch.insertMany(batches);
  console.log(`✅ Seeded ${batches.length} batches`);

  await Alert.insertMany(alerts);
  console.log(`✅ Seeded ${alerts.length} alerts`);

  await mongoose.disconnect();
  console.log('🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
