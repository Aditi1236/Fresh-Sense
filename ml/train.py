"""
train.py — FreshSense ML Model Training
Generates synthetic data and trains a RandomForestRegressor.
Run: python train.py (from the project root or ml/ directory)
"""
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# ── Product configuration ──────────────────────────────────────────────────────
PRODUCT_CONFIG = {
    'Strawberry': {'opt_temp_min': 0,  'opt_temp_max': 4,  'opt_humidity': 85},
    'Milk':       {'opt_temp_min': 2,  'opt_temp_max': 6,  'opt_humidity': 75},
    'Spinach':    {'opt_temp_min': 0,  'opt_temp_max': 5,  'opt_humidity': 90},
    'Mango':      {'opt_temp_min': 10, 'opt_temp_max': 15, 'opt_humidity': 80},
    'Fish':       {'opt_temp_min': 0,  'opt_temp_max': 4,  'opt_humidity': 78},
}


def compute_risk(product: str, temperature: float, humidity: float, transit_time: float) -> float:
    cfg = PRODUCT_CONFIG.get(product, {'opt_temp_min': 2, 'opt_temp_max': 8, 'opt_humidity': 82})
    if temperature < cfg['opt_temp_min']:
        temp_dev = cfg['opt_temp_min'] - temperature
    elif temperature > cfg['opt_temp_max']:
        temp_dev = temperature - cfg['opt_temp_max']
    else:
        temp_dev = 0.0

    temp_risk    = min(temp_dev * 15, 50)
    hum_risk     = min(abs(humidity - cfg['opt_humidity']) * 0.5, 20)
    transit_risk = min(transit_time * 1.5, 30)
    return min(temp_risk + hum_risk + transit_risk, 100)


# ── Generate synthetic training data ──────────────────────────────────────────
np.random.seed(42)
products = list(PRODUCT_CONFIG.keys())
rows = []

for _ in range(3000):
    product = np.random.choice(products)
    cfg     = PRODUCT_CONFIG[product]
    temperature  = np.random.uniform(cfg['opt_temp_min'] - 2, cfg['opt_temp_max'] + 8)
    humidity     = np.random.uniform(55, 98)
    transit_time = np.random.uniform(1, 36)

    if temperature < cfg['opt_temp_min']:
        temp_dev = cfg['opt_temp_min'] - temperature
    elif temperature > cfg['opt_temp_max']:
        temp_dev = temperature - cfg['opt_temp_max']
    else:
        temp_dev = 0.0

    risk  = compute_risk(product, temperature, humidity, transit_time)
    noise = np.random.uniform(-4, 4)
    risk  = float(np.clip(risk + noise, 0, 100))

    rows.append({
        'product':      product,
        'temperature':  temperature,
        'humidity':     humidity,
        'transitTime':  transit_time,
        'tempDeviation': temp_dev,
        'riskScore':    risk,
    })

df = pd.DataFrame(rows)

# Encode product
le = LabelEncoder()
df['product_enc'] = le.fit_transform(df['product'])

X = df[['product_enc', 'temperature', 'humidity', 'transitTime', 'tempDeviation']]
y = df['riskScore']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── Train ──────────────────────────────────────────────────────────────────────
model = RandomForestRegressor(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# ── Save ───────────────────────────────────────────────────────────────────────
save_dir  = os.path.dirname(os.path.abspath(__file__))
save_path = os.path.join(save_dir, 'model.pkl')
joblib.dump({'model': model, 'label_encoder': le}, save_path)

print('✅ Model trained and saved to', save_path)
print(f'   Training samples : {len(X_train)}')
print(f'   Test samples     : {len(X_test)}')
print(f'   Products encoded : {list(le.classes_)}')
print('   Note: Model performance is evaluated on synthetic data only.')
