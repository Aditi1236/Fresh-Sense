const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Call the Python ML service for a prediction.
 * Throws if the service is unavailable.
 */
async function getPrediction({ product, temperature, humidity, transitTime }) {
  const response = await axios.post(
    `${ML_SERVICE_URL}/predict`,
    { product, temperature, humidity, transitTime },
    { timeout: 3000 }
  );
  return response.data;
}

module.exports = { getPrediction };
