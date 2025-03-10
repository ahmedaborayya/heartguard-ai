# HeartGuard AI - Heart Disease Risk Assessment System

## Overview
HeartGuard AI is a comprehensive healthcare application that leverages machine learning to assess heart disease risk and provide personalized health recommendations. The system combines advanced ML models with expert medical knowledge to deliver accurate risk assessments and actionable insights for both patients and healthcare providers.

## Features
- 🔍 **AI-Powered Risk Assessment**: Advanced machine learning model for heart disease risk prediction
- 👤 **User Role Management**: Separate interfaces for patients and healthcare providers
- 📊 **Detailed Health Metrics**: Comprehensive health data collection and analysis
- 💡 **Personalized Recommendations**: AI-generated health recommendations based on risk factors
- 👨‍⚕️ **Doctor Review System**: Healthcare provider review and feedback mechanism
- 📱 **Modern UI/UX**: Responsive and intuitive user interface
- 🔒 **Secure Authentication**: JWT-based secure user authentication
- 📈 **Health History Tracking**: Patient health assessment history and progress monitoring

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT with OAuth2
- **ML Libraries**: scikit-learn, joblib
- **API Documentation**: OpenAPI (Swagger UI)

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 13+
- Git

## Installation

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/heartguard-ai.git
cd heartguard-ai/backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
python create_db.py
```

6. Run the backend server:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
heartguard-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── ml_models/
│   ├── tests/
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── public/
    └── package.json
```

## API Documentation
Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Key Features Implementation

### Authentication System
- JWT-based authentication
- Role-based access control (Patient, Doctor, Admin)
- Secure password hashing with bcrypt
- Token refresh mechanism

### ML Model Integration
- Pre-trained heart disease risk assessment model
- Feature preprocessing and validation
- Risk factor calculation
- Personalized health recommendations

### Doctor Review System
- Comprehensive review interface
- Medical notes and recommendations
- Follow-up scheduling
- Risk level assessment

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing
Run the test suite:
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Deployment
The application can be deployed using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Security Considerations
- All API endpoints are protected with JWT authentication
- Passwords are hashed using bcrypt
- Input validation using Pydantic models
- CORS protection
- Rate limiting
- SQL injection prevention through SQLAlchemy

## Performance Optimization
- Database query optimization
- Caching mechanisms
- Lazy loading of ML models
- Efficient frontend bundle splitting

## Monitoring and Logging
- Application logging
- Error tracking
- Performance monitoring
- User activity tracking

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Dataset: [Heart Disease Dataset](https://www.kaggle.com/datasets/kamilpytlak/personal-key-indicators-of-heart-disease)
- ML Model: Custom trained model using scikit-learn
- UI Components: Tailwind CSS and custom components

## Support
For support, email support@heartguard-ai.com or create an issue in the repository.

## Roadmap
- [ ] Integration with wearable devices
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Telemedicine features
- [ ] Integration with electronic health records (EHR)

## Contact
- Website: https://heartguard-ai.com
- Email: contact@heartguard-ai.com
- Twitter: @HeartGuardAI
- LinkedIn: HeartGuard AI