/**
 * Rule-based spoilage risk engine.
 * Used as primary scorer (or fallback when ML service is unavailable).
 */

const PRODUCT_CONFIG = {
  Strawberry: { optTempMin: 0,  optTempMax: 4,  optHumidity: 85 },
  Milk:       { optTempMin: 2,  optTempMax: 6,  optHumidity: 75 },
  Spinach:    { optTempMin: 0,  optTempMax: 5,  optHumidity: 90 },
  Mango:      { optTempMin: 10, optTempMax: 15, optHumidity: 80 },
  Fish:       { optTempMin: 0,  optTempMax: 4,  optHumidity: 78 },
};

const DEFAULT_CONFIG = { optTempMin: 2, optTempMax: 8, optHumidity: 82 };

function getConfig(product) {
  return PRODUCT_CONFIG[product] || DEFAULT_CONFIG;
}

function getTempDeviation(temperature, cfg) {
  if (temperature < cfg.optTempMin) return cfg.optTempMin - temperature;
  if (temperature > cfg.optTempMax) return temperature - cfg.optTempMax;
  return 0;
}

function getFactorLevel(value, medThreshold, highThreshold) {
  if (value >= highThreshold) return 'HIGH';
  if (value >= medThreshold)  return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate spoilage risk.
 * @param {object} params - { product, temperature, humidity, transitTime }
 * @returns {{ riskScore, riskLevel, tempDeviation, factors, reason }}
 */
function calculateRisk({ product, temperature, humidity, transitTime }) {
  const cfg = getConfig(product);

  const tempDeviation = getTempDeviation(temperature, cfg);
  const tempRisk      = Math.min(tempDeviation * 15, 50);
  const humRisk       = Math.min(Math.abs(humidity - cfg.optHumidity) * 0.5, 20);
  const transitRisk   = Math.min(transitTime * 1.5, 30);

  const raw = tempRisk + humRisk + transitRisk;
  const riskScore = Math.min(Math.round(raw), 100);

  let riskLevel;
  if      (riskScore <= 30) riskLevel = 'SAFE';
  else if (riskScore <= 60) riskLevel = 'MEDIUM';
  else if (riskScore <= 85) riskLevel = 'HIGH';
  else                      riskLevel = 'CRITICAL';

  const factors = {
    temperature: getFactorLevel(tempDeviation, 2, 4),
    humidity:    getFactorLevel(Math.abs(humidity - cfg.optHumidity), 5, 10),
    transit:     getFactorLevel(transitTime, 12, 20),
  };

  return { riskScore, riskLevel, tempDeviation, factors };
}

/**
 * Generate a plain-language risk explanation.
 */
function getRiskReason({ product, temperature, humidity, transitTime, riskScore, riskLevel }) {
  const cfg = getConfig(product);
  const tempDeviation = getTempDeviation(temperature, cfg);

  const parts = [];
  if (tempDeviation > 0) {
    parts.push(
      `the temperature (${temperature}°C) is ${tempDeviation.toFixed(1)}°C above the safe range for ${product} (${cfg.optTempMin}–${cfg.optTempMax}°C)`
    );
  }
  if (Math.abs(humidity - cfg.optHumidity) > 5) {
    parts.push(`the humidity (${humidity}%) deviates from the optimal level (${cfg.optHumidity}%)`);
  }
  if (transitTime > 12) {
    parts.push(`the extended transit time of ${transitTime} hours increases cumulative exposure risk`);
  }

  if (parts.length === 0) {
    return `The estimated risk is ${riskLevel} (${riskScore}%). All parameters are within acceptable ranges, but continued monitoring is advised.`;
  }

  return `The estimated risk is ${riskLevel} (${riskScore}%) because ${parts.join(', and ')}. This is an estimate based on current sensor readings — actual spoilage may vary.`;
}

module.exports = { calculateRisk, getRiskReason, getConfig };
