import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from pathlib import Path
from ..core.config import settings
from ..schemas.prediction import PredictionCreate

class MLService:
    def __init__(self):
        """
        Initialize the ML service and load the model.
        """
        self.model = None
        self.model_path = Path(settings.MODEL_PATH)
        self._load_model()
        self.feature_names = [
            'BMI', 'Smoking', 'AlcoholDrinking', 'Stroke', 'PhysicalHealth',
            'MentalHealth', 'DiffWalking', 'Sex', 'AgeCategory', 'Race',
            'Diabetic', 'PhysicalActivity', 'GenHealth', 'SleepTime',
            'Asthma', 'KidneyDisease', 'SkinCancer'
        ]

    def _load_model(self):
        """
        Load the ML model from the specified path.
        """
        try:
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            self.model = joblib.load(self.model_path)
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            self.model = None

    def preprocess_input(self, data: PredictionCreate) -> pd.DataFrame:
        """Preprocess the input data for prediction"""
        input_dict = {
            'BMI': data.bmi,
            'Smoking': 'Yes' if data.smoking else 'No',
            'AlcoholDrinking': 'Yes' if data.alcohol_drinking else 'No',
            'Stroke': 'Yes' if data.stroke else 'No',
            'PhysicalHealth': data.physical_health,
            'MentalHealth': data.mental_health,
            'DiffWalking': 'Yes' if data.diff_walking else 'No',
            'Sex': data.sex,
            'AgeCategory': data.age_category,
            'Race': data.race,
            'Diabetic': 'Yes' if data.diabetic else 'No',
            'PhysicalActivity': 'Yes' if data.physical_activity else 'No',
            'GenHealth': data.gen_health,
            'SleepTime': data.sleep_time,
            'Asthma': 'Yes' if data.asthma else 'No',
            'KidneyDisease': 'Yes' if data.kidney_disease else 'No',
            'SkinCancer': 'Yes' if data.skin_cancer else 'No'
        }
        return pd.DataFrame([input_dict])

    def predict(self, data: PredictionCreate) -> Tuple[bool, List[Dict], List[str]]:
        """Make prediction and return result with risk factors and recommendations"""
        # Preprocess input
        df = self.preprocess_input(data)
        
        # Make prediction
        prediction = bool(self.model.predict(df)[0])
        
        # Calculate risk factors
        risk_factors = self._calculate_risk_factors(data)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(data, risk_factors)
        
        return prediction, risk_factors, recommendations

    def _calculate_risk_factors(self, data: PredictionCreate) -> List[Dict]:
        """Calculate risk factors based on input data"""
        risk_factors = []
        
        # BMI Risk
        if data.bmi >= 30:
            risk_factors.append({
                'name': 'BMI',
                'level': 'high',
                'value': data.bmi,
                'description': 'BMI indicates obesity'
            })
        elif data.bmi >= 25:
            risk_factors.append({
                'name': 'BMI',
                'level': 'medium',
                'value': data.bmi,
                'description': 'BMI indicates overweight'
            })

        # Lifestyle Risks
        if data.smoking:
            risk_factors.append({
                'name': 'Smoking',
                'level': 'high',
                'value': True,
                'description': 'Active smoking significantly increases heart disease risk'
            })

        if data.alcohol_drinking:
            risk_factors.append({
                'name': 'Alcohol',
                'level': 'medium',
                'value': True,
                'description': 'Regular alcohol consumption may increase health risks'
            })

        # Health Conditions
        if data.stroke:
            risk_factors.append({
                'name': 'Stroke History',
                'level': 'high',
                'value': True,
                'description': 'Previous stroke indicates high cardiovascular risk'
            })

        if data.diabetic:
            risk_factors.append({
                'name': 'Diabetes',
                'level': 'high',
                'value': True,
                'description': 'Diabetes increases heart disease risk'
            })

        # Physical Health
        if not data.physical_activity:
            risk_factors.append({
                'name': 'Physical Inactivity',
                'level': 'medium',
                'value': True,
                'description': 'Lack of physical activity increases health risks'
            })

        if data.sleep_time < 6 or data.sleep_time > 9:
            risk_factors.append({
                'name': 'Sleep Pattern',
                'level': 'medium',
                'value': data.sleep_time,
                'description': 'Irregular sleep pattern may affect heart health'
            })

        return risk_factors

    def _generate_recommendations(
        self, data: PredictionCreate, risk_factors: List[Dict]
    ) -> List[str]:
        """Generate personalized recommendations based on risk factors"""
        recommendations = []

        for risk in risk_factors:
            if risk['name'] == 'BMI' and risk['level'] in ['medium', 'high']:
                recommendations.extend([
                    'Consider a structured weight management program',
                    'Consult with a nutritionist for a personalized diet plan',
                    'Aim for 150 minutes of moderate aerobic activity weekly'
                ])

            elif risk['name'] == 'Smoking':
                recommendations.extend([
                    'Quit smoking - consider nicotine replacement therapy',
                    'Join a smoking cessation program',
                    'Schedule regular check-ups to monitor progress'
                ])

            elif risk['name'] == 'Alcohol':
                recommendations.append(
                    'Limit alcohol consumption and consider joining a support group if needed'
                )

            elif risk['name'] == 'Physical Inactivity':
                recommendations.extend([
                    'Start with short daily walks and gradually increase activity',
                    'Consider joining a guided exercise program',
                    'Find physical activities you enjoy to make it sustainable'
                ])

            elif risk['name'] == 'Sleep Pattern':
                recommendations.extend([
                    'Establish a regular sleep schedule',
                    'Create a relaxing bedtime routine',
                    'Avoid screens before bedtime'
                ])

        # General recommendations
        if data.diabetic:
            recommendations.extend([
                'Monitor blood sugar levels regularly',
                'Follow your diabetes management plan strictly',
                'Schedule regular check-ups with your endocrinologist'
            ])

        if not recommendations:
            recommendations = [
                'Maintain current healthy lifestyle habits',
                'Schedule regular check-ups with your healthcare provider',
                'Stay active and maintain a balanced diet'
            ]

        return list(set(recommendations))  # Remove duplicates

    def is_ready(self) -> bool:
        """
        Check if the model is loaded and ready for predictions.
        """
        return self.model is not None

# Create a singleton instance
ml_service = MLService()