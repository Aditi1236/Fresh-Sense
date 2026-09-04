"""
model.py — FreshSense ML Prediction Service
Flask REST API wrapping the trained RandomForest model.
Run: python model.py  (starts on port 8000)
"""
import os
import joblib
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# ── Load model ─────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
model_data = None
if os.path.exists(MODEL_PATH):
    model_data = joblib.load(MODEL_PATH)
    print('✅ Model loaded from', MODEL_PATH)
else:
    print('⚠️  model.pkl not found — run train.py first. /predict will return 503.')

PRODUCT_CONFIG = {
    'Strawberry': {'opt_temp_min': 0,  'opt_temp_max': 4},
    'Milk':       {'opt_temp_min': 2,  'opt_temp_max': 6},
    'Spinach':    {'opt_temp_min': 0,  'opt_temp_max': 5},
    'Mango':      {'opt_temp_min': 10, 'opt_temp_max': 15},
    'Fish':       {'opt_temp_min': 0,  'opt_temp_max': 4},
}


def get_risk_level(score: float) -> str:
    if score <= 30:  return 'SAFE'
    if score <= 60:  return 'MEDIUM'
    if score <= 85:  return 'HIGH'
    return 'CRITICAL'


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model_data is not None})


@app.route('/predict', methods=['POST'])
def predict():
    if model_data is None:
        return jsonify({'error': 'Model not loaded. Run train.py first.'}), 503

    data         = request.get_json(force=True)
    product      = data.get('product', 'Strawberry')
    temperature  = float(data.get('temperature', 5))
    humidity     = float(data.get('humidity', 85))
    transit_time = float(data.get('transitTime', 12))

    cfg = PRODUCT_CONFIG.get(product, {'opt_temp_min': 2, 'opt_temp_max': 8})
    if temperature < cfg['opt_temp_min']:
        temp_dev = cfg['opt_temp_min'] - temperature
    elif temperature > cfg['opt_temp_max']:
        temp_dev = temperature - cfg['opt_temp_max']
    else:
        temp_dev = 0.0

    model = model_data['model']
    le    = model_data['label_encoder']

    try:
        product_enc = int(le.transform([product])[0])
    except ValueError:
        product_enc = 0  # unknown product — use index 0

    features   = np.array([[product_enc, temperature, humidity, transit_time, temp_dev]])
    risk_score = float(np.clip(model.predict(features)[0], 0, 100))
    risk_level = get_risk_level(risk_score)

    return jsonify({
        'riskScore':     round(risk_score, 1),
        'riskLevel':     risk_level,
        'tempDeviation': round(temp_dev, 2),
        'source':        'ml',
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
