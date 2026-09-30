from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)


CORS(app)

# Load the trained machine learning pipeline
try:
    model = joblib.load('car_price_model.pkl')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Make sure 'car_price_model.pkl' is in the exact same folder as app.py")

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from frontned 
        data = request.json
        df = pd.DataFrame([data])
        
        # Force numeric columns to be interpreted as numbers (not strings)
        numeric_cols = ['Year', 'Present_Price', 'Kms_Driven', 'Owner']
        df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric)
        prediction = model.predict(df)[0]
        

        return jsonify({
            'status': 'success',
            'predicted_price': round(float(prediction), 2)
        })

    except Exception as e:
       
        return jsonify({
            'status': 'error', 
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)