# Used Car Price Predictor

A full-stack web application that predicts the market value of used cars using a tuned Machine Learning model. The project features a sleek, responsive React frontend (styled with Tailwind CSS) and a lightweight Python Flask API that serves the trained scikit-learn pipeline.

## Features
* **Accurate Predictions:** Uses a Random Forest Regressor optimized via Grid Search Cross-Validation.
* **End-to-End Pipeline:** The saved ML model handles its own data preprocessing (scaling and encoding) directly from raw user input.
* **Modern UI:** A clean, glassmorphism-inspired interface built with React, TypeScript, and Tailwind CSS.
* **REST API:** A Flask backend that handles POST requests and returns real-time predictions.

## Tech Stack
**Frontend:**
* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM

**Backend / Machine Learning:**
* Python 3
* Flask & Flask-CORS
* Scikit-Learn
* Pandas & NumPy
* Joblib (Model Serialization)

---

## Project Structure

```text
CarPricePrediction/
├── node_modules/
├── public/
├── Python\Backend/
│   ├── app.py
│   ├── car_price_model.pkl
│   └── TrainingCode.py
├── src/
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   └── CarPricePredictor.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts