import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

# Models
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR

# Load Data
car_dataset = pd.read_csv('/content/car data.csv')
car_dataset.info()
# Separating  Features (X) and Target (Y)
X = car_dataset.drop(['Car_Name', 'Selling_Price'], axis=1)
Y = car_dataset['Selling_Price']

#  Defining feature columns
numeric_features = ['Year', 'Present_Price', 'Kms_Driven', 'Owner']
categorical_features = ['Fuel_Type', 'Seller_Type', 'Transmission']

#  Create Preprocessing Pipelines
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])


X_Train, X_Test, Y_Train, Y_Test = train_test_split(X, Y, test_size=0.1, random_state=2)


models = {
    "Linear Regression": LinearRegression(),
    "Lasso": Lasso(),
    "Ridge": Ridge(),
    "Decision Tree": DecisionTreeRegressor(random_state=42),
    "Random Forest": RandomForestRegressor(random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(random_state=42),
    "KNN": KNeighborsRegressor(),
    "SVR": SVR()
}

# Run Cross-Validation on Training Data ONLY
print("--- Step 1: 5-Fold Cross-Validation on Training Data ---")
cv_results = {}

for name, model in models.items():
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', model)
    ])
    
    cv_scores = cross_val_score(pipeline, X_Train, Y_Train, cv=5, scoring='r2')
    avg_score = cv_scores.mean()
    cv_results[name] = avg_score
    print(f"{name:18} | Avg R2: {avg_score:.4f}")


best_model_name = max(cv_results, key=cv_results.get)
best_model = models[best_model_name]
print(f"\n🏆 Winner of Cross-Validation: {best_model_name} (Score: {cv_results[best_model_name]:.4f})")

# HYPERPARAMETER TUNING
print("\n--- Step 2: Hyperparameter Tuning ---")

tuning_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', best_model)
])

param_grid = {
    'regressor__n_estimators': [50, 100, 200],      
    'regressor__max_depth': [None, 10, 20],         
    'regressor__min_samples_split': [2, 5, 10]      
}

# Set up the Grid Search Tuner
grid_search = GridSearchCV(
    estimator=tuning_pipeline,
    param_grid=param_grid,
    cv=5,
    scoring='r2',
    n_jobs=-1 
)

print("Testing all combinations of hyperparameters...")
grid_search.fit(X_Train, Y_Train)

print(f"Best settings found: {grid_search.best_params_}")
print(f"Best cross-validation R2: {grid_search.best_score_:.4f}")


print(f"\n--- Step 3: Final Evaluation on Unseen Test Data ---")
best_tuned_pipeline = grid_search.best_estimator_

tuned_predictions = best_tuned_pipeline.predict(X_Test)

print(f"Tuned Test R2   : {r2_score(Y_Test, tuned_predictions):.4f}")
print(f"Tuned Test MAE  : {mean_absolute_error(Y_Test, tuned_predictions):.4f}")
print(f"Tuned Test RMSE : {np.sqrt(mean_squared_error(Y_Test, tuned_predictions)):.4f}")

# Saving  Model
joblib.dump(best_tuned_pipeline, 'car_price_model.pkl')
print("\nModel saved successfully as 'car_price_model.pkl'!")