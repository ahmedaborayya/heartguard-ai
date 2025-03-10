import React, { useState } from 'react';
import { Heart, AlertTriangle, Activity, Brain, User, Ruler, Stethoscope, ActivitySquare, Loader2, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { FormData, RiskFactor } from '../types';
import { AGE_CATEGORIES, RACE_CATEGORIES } from '../types';
import SelectField from './form/SelectField';
import NumberField from './form/NumberField';
import FormProgress from './form/FormProgress';
import FormSection from './form/FormSection';
import RiskFactorsAnalysis from './prediction/RiskFactorsAnalysis';
import { notify } from '../utils/notifications';
import { notifyAssessmentComplete } from '../utils/notificationUtils';

const RiskIndicator: React.FC<{ level: RiskFactor['level'] }> = ({ level }) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${colors[level]}`} />
      <span className="text-sm capitalize">{level} Risk</span>
    </div>
  );
};

const calculateRiskScore = (factor: Partial<RiskFactor>): number => {
  switch (factor.level) {
    case 'high':
      return 30;
    case 'medium':
      return 60;
    case 'low':
      return 90;
    default:
      return 100;
  }
};

const FORM_STEPS = [
  'Personal Information',
  'Lifestyle Factors',
  'Health Status',
  'Medical History'
];

const PredictionForm: React.FC = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    heartDisease: 'No',
    bmi: 25,
    smoking: 'No',
    alcoholDrinking: 'No',
    stroke: 'No',
    physicalHealth: 0,
    mentalHealth: 0,
    diffWalking: 'No',
    sex: 'Male',
    ageCategory: '18-24',
    race: 'White',
    diabetic: 'No',
    physicalActivity: 'Yes',
    genHealth: 'Good',
    sleepTime: 7,
    asthma: 'No',
    kidneyDisease: 'No',
    skinCancer: 'No'
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const analyzeRiskFactors = (data: FormData): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    // Age-Related Risk Analysis
    const ageNumber = parseInt(data.ageCategory.split('-')[0]);
    if (ageNumber >= 65) {
      factors.push({
        name: 'Age',
        level: 'high',
        value: data.ageCategory,
        trend: 'stable',
        score: 30,
        recommendation: 'Age is a significant risk factor. Regular cardiovascular check-ups are essential.',
        details: [
          'Higher risk of cardiovascular events',
          'Need for more frequent health monitoring',
          'Important to maintain active lifestyle'
        ]
      });
    } else if (ageNumber >= 45) {
      factors.push({
        name: 'Age',
        level: 'medium',
        value: data.ageCategory,
        trend: 'stable',
        score: 60,
        recommendation: 'Consider more frequent health screenings and preventive care.',
        details: [
          'Increasing risk with age',
          'Focus on preventive measures',
          'Regular health check-ups recommended'
        ]
      });
    }

    // Gender-Specific Risk Analysis
    if (data.sex === 'Male' && ageNumber > 45) {
      factors.push({
        name: 'Gender Risk',
        level: 'medium',
        value: 'Male over 45',
        trend: 'stable',
        score: 60,
        recommendation: 'Men over 45 have increased heart disease risk. Regular stress tests recommended.',
        details: [
          'Increased risk of cardiovascular events',
          'Focus on regular health monitoring',
          'Recommendation for stress tests'
        ]
      });
    } else if (data.sex === 'Female' && ageNumber > 55) {
      factors.push({
        name: 'Gender Risk',
        level: 'medium',
        value: 'Female over 55',
        trend: 'stable',
        score: 60,
        recommendation: 'Post-menopausal women have increased cardiovascular risk. Consider hormone and heart health evaluation.',
        details: [
          'Increased risk of cardiovascular events',
          'Focus on hormone and heart health',
          'Recommendation for hormone evaluation'
        ]
      });
    }

    // BMI Analysis
    const bmiLevel = data.bmi < 18.5 || data.bmi > 30 ? 'high' : 
                    data.bmi < 25 ? 'low' : 'medium';
    const bmiCategory = data.bmi < 18.5 ? 'Underweight' :
                       data.bmi < 25 ? 'Normal weight' :
                       data.bmi < 30 ? 'Overweight' : 'Obese';
    
    const bmiScore = data.bmi < 18.5 ? 40 :
                    data.bmi < 25 ? 90 :
                    data.bmi < 30 ? 60 : 30;

    factors.push({
      name: 'BMI',
      level: bmiLevel,
      value: `${data.bmi} (${bmiCategory})`,
      trend: 'stable', // This would be calculated from historical data
      score: bmiScore,
      recommendation: bmiLevel === 'high' 
        ? data.bmi > 30 
          ? 'Your BMI indicates obesity. Consider consulting a healthcare provider about weight management strategies and cardiovascular health.'
          : 'Your BMI is below normal range. Consult a healthcare provider about healthy weight gain and potential underlying conditions.'
        : bmiLevel === 'medium'
          ? 'Your BMI indicates overweight. Focus on balanced diet, portion control, and regular exercise.'
          : 'Maintain your healthy BMI through continued healthy lifestyle habits.',
      details: [
        `Current BMI: ${data.bmi}`,
        `Category: ${bmiCategory}`,
        'BMI is a key indicator of cardiovascular health'
      ]
    });

    // Combined Health Conditions Analysis
    const conditions = [];
    if (data.heartDisease === 'Yes') conditions.push('Heart Disease');
    if (data.stroke === 'Yes') conditions.push('Stroke');
    if (data.diabetic === 'Yes') conditions.push('Diabetes');
    if (data.kidneyDisease === 'Yes') conditions.push('Kidney Disease');
    if (conditions.length > 0) {
      factors.push({
        name: 'Multiple Health Conditions',
        level: 'high',
        value: conditions.join(', '),
        trend: 'stable',
        score: 30,
        recommendation: `Having multiple conditions (${conditions.join(', ')}) significantly increases cardiovascular risk. Coordinate care between specialists and maintain strict medication adherence.`,
        details: [
          `Conditions: ${conditions.join(', ')}`,
          'Multiple conditions increase risk',
          'Coordinate care between specialists'
        ]
      });
    }

    // Lifestyle Risk Cluster
    const lifestyleRisks = [];
    if (data.smoking === 'Yes') lifestyleRisks.push('Smoking');
    if (data.alcoholDrinking === 'Yes') lifestyleRisks.push('Alcohol');
    if (data.physicalActivity === 'No') lifestyleRisks.push('Physical Inactivity');
    if (lifestyleRisks.length >= 2) {
      factors.push({
        name: 'Multiple Lifestyle Risks',
        level: 'high',
        value: lifestyleRisks.join(', '),
        trend: 'stable',
        score: 30,
        recommendation: 'Multiple lifestyle risk factors significantly increase heart disease risk. Consider lifestyle modification program or health coaching.',
        details: [
          `Lifestyle risks: ${lifestyleRisks.join(', ')}`,
          'Multiple lifestyle risks increase risk',
          'Recommend lifestyle modification'
        ]
      });
    }

    // Individual Lifestyle Factors
    if (data.smoking === 'Yes') {
      factors.push({
        name: 'Smoking',
        level: 'high',
        value: 'Active Smoker',
        trend: 'stable',
        score: 20,
        recommendation: 'Smoking significantly increases heart disease risk. Consider smoking cessation programs, nicotine replacement therapy, or medications to help quit.',
        details: [
          'Major risk factor for heart disease',
          'Increases blood pressure and heart rate',
          'Damages blood vessels'
        ]
      });
    }

    if (data.alcoholDrinking === 'Yes') {
      factors.push({
        name: 'Alcohol Consumption',
        level: 'medium',
        value: 'Regular Drinker',
        trend: 'stable',
        score: 60,
        recommendation: 'Limit alcohol intake to recommended levels (1 drink/day for women, 2 for men). Consider alcohol reduction program if needed.',
        details: [
          'Increases risk of cardiovascular events',
          'Recommendation for alcohol reduction',
          'Limit intake to recommended levels'
        ]
      });
    }

    // Physical Activity and Mobility Cluster
    if (data.physicalActivity === 'No' || data.diffWalking === 'Yes') {
      const mobilityIssues = [];
      if (data.physicalActivity === 'No') mobilityIssues.push('Physical Inactivity');
      if (data.diffWalking === 'Yes') mobilityIssues.push('Walking Difficulty');
      
      factors.push({
        name: 'Physical Activity & Mobility',
        level: 'high',
        value: mobilityIssues.join(', '),
        trend: 'stable',
        score: 30,
        recommendation: `Limited mobility and physical activity increase health risks. Consider adapted exercise programs, physical therapy, or supervised fitness training.`,
        details: [
          `Mobility issues: ${mobilityIssues.join(', ')}`,
          'Limited mobility increases risk',
          'Recommend adapted exercise programs'
        ]
      });
    }

    // Mental and Physical Health Correlation
    if (data.mentalHealth > 14 && data.physicalHealth > 14) {
      factors.push({
        name: 'Mental-Physical Health Impact',
        level: 'high',
        value: `Mental: ${data.mentalHealth} days, Physical: ${data.physicalHealth} days`,
        trend: 'stable',
        score: 30,
        recommendation: 'Strong correlation between mental and physical health issues. Consider integrated health approach with both mental health support and physical therapy.',
        details: [
          'Strong correlation between mental and physical health',
          'Recommend integrated health approach',
          'Focus on mental and physical health'
        ]
      });
    } else {
      // Individual health checks
      if (data.physicalHealth > 14) {
        factors.push({
          name: 'Physical Health',
          level: 'high',
          value: `${data.physicalHealth} days of poor health`,
          trend: 'stable',
          score: 30,
          recommendation: `${data.physicalHealth} days of poor physical health per month indicates need for comprehensive medical evaluation and treatment plan.`,
          details: [
            'Poor physical health indicates need for medical evaluation',
            'Recommend comprehensive medical evaluation',
            'Focus on physical health'
          ]
        });
      }
      if (data.mentalHealth > 14) {
        factors.push({
          name: 'Mental Health',
          level: 'high',
          value: `${data.mentalHealth} days of poor health`,
          trend: 'stable',
          score: 30,
          recommendation: `${data.mentalHealth} days of poor mental health per month. Consider professional mental health support and stress management techniques.`,
          details: [
            'Poor mental health indicates need for mental health support',
            'Recommend professional mental health support',
            'Focus on mental health'
          ]
        });
      }
    }

    // Sleep Health Analysis
    if (data.sleepTime < 6 || data.sleepTime > 9) {
      const sleepCategory = data.sleepTime < 6 ? 'Insufficient' : 'Excessive';
      factors.push({
        name: 'Sleep Pattern',
        level: 'medium',
        value: `${data.sleepTime} hours (${sleepCategory})`,
        trend: 'stable',
        score: 60,
        recommendation: `${sleepCategory} sleep duration can impact cardiovascular health. Aim for 7-9 hours nightly. Consider sleep study or consultation with sleep specialist.`,
        details: [
          `Sleep duration: ${data.sleepTime} hours`,
          `Category: ${sleepCategory}`,
          'Sleep is important for cardiovascular health'
        ]
      });
    }

    // General Health Status
    if (data.genHealth === 'Fair' || data.genHealth === 'Poor') {
      factors.push({
        name: 'Overall Health Status',
        level: data.genHealth === 'Poor' ? 'high' : 'medium',
        value: data.genHealth,
        trend: 'stable',
        score: data.genHealth === 'Poor' ? 30 : 60,
        recommendation: `${data.genHealth} self-rated health often indicates underlying issues. Schedule comprehensive health evaluation and discuss lifestyle improvements with healthcare provider.`,
        details: [
          `Health self-assessment: ${data.genHealth}`,
          'Poor health indicates underlying issues',
          'Recommend comprehensive health evaluation'
        ]
      });
    }

    // Respiratory Health
    if (data.asthma === 'Yes') {
      factors.push({
        name: 'Respiratory Health',
        level: 'medium',
        value: 'Asthma Present',
        trend: 'stable',
        score: 60,
        recommendation: 'Asthma can impact heart health. Ensure proper asthma management and discuss cardiovascular implications with your healthcare provider.',
        details: [
          'Asthma can impact heart health',
          'Recommend proper asthma management',
          'Focus on respiratory health'
        ]
      });
    }

    // Chronic Disease Burden
    const chronicConditions = [];
    if (data.heartDisease === 'Yes') chronicConditions.push('Heart Disease');
    if (data.kidneyDisease === 'Yes') chronicConditions.push('Kidney Disease');
    if (data.skinCancer === 'Yes') chronicConditions.push('Skin Cancer');
    if (chronicConditions.length > 0) {
      factors.push({
        name: 'Chronic Disease Management',
        level: 'high',
        value: chronicConditions.join(', '),
        trend: 'stable',
        score: 30,
        recommendation: 'Multiple chronic conditions require coordinated care. Work with your healthcare team to manage all conditions effectively.',
        details: [
          `Chronic conditions: ${chronicConditions.join(', ')}`,
          'Multiple chronic conditions require coordinated care',
          'Recommend working with healthcare team'
        ]
      });
    }

    return factors;
  };

  const handleNextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleAnalyze = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockRiskScore = Math.floor(Math.random() * 100);
        setPrediction(mockRiskScore);
        setRiskFactors(analyzeRiskFactors(formData));
        setLoading(false);
        notify.success('Assessment completed successfully');
        notifyAssessmentComplete(mockRiskScore);
      }, 1500);
    } catch (error) {
      console.error('Error analyzing risk factors:', error);
      notify.error('Failed to complete assessment');
      setLoading(false);
    }
  };

  const yesNoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  const genHealthOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Very Good', label: 'Very Good' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' }
  ];

  const ageCategoryOptions = AGE_CATEGORIES.map(age => ({
    value: age,
    label: age
  }));

  const raceOptions = RACE_CATEGORIES.map(race => ({
    value: race,
    label: race
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl -z-10">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-full blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-red-100">
                <Heart className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
            Heart Failure Risk Assessment
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Complete this comprehensive health assessment to evaluate your heart failure risk factors and receive personalized recommendations.
          </p>
        </div>

        <FormProgress
          steps={FORM_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <FormSection
            title="Personal Information"
            icon={User}
            color="blue"
            visible={currentStep === 0}
          >
            <SelectField
              label="Sex"
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
              ]}
            />
            <SelectField
              label="Age Category"
              name="ageCategory"
              value={formData.ageCategory}
              onChange={handleInputChange}
              options={ageCategoryOptions}
            />
            <SelectField
              label="Race"
              name="race"
              value={formData.race}
              onChange={handleInputChange}
              options={raceOptions}
            />
            <NumberField
              label="BMI"
              name="bmi"
              value={formData.bmi}
              onChange={handleInputChange}
              min={10}
              max={60}
              step={0.1}
              hint="Body Mass Index (weight in kg / height in m²)"
            />
            <NumberField
              label="Sleep Time (hours)"
              name="sleepTime"
              value={formData.sleepTime}
              onChange={handleInputChange}
              min={0}
              max={24}
              step={0.5}
              hint="Average hours of sleep per night"
            />
          </FormSection>

          <FormSection
            title="Lifestyle Factors"
            icon={Activity}
            color="green"
            visible={currentStep === 1}
          >
            <SelectField
              label="Smoking"
              name="smoking"
              value={formData.smoking}
              onChange={handleInputChange}
              options={yesNoOptions}
              hint="Current smoking status"
            />
            <SelectField
              label="Alcohol Drinking"
              name="alcoholDrinking"
              value={formData.alcoholDrinking}
              onChange={handleInputChange}
              options={yesNoOptions}
              hint="Regular alcohol consumption"
            />
            <SelectField
              label="Physical Activity"
              name="physicalActivity"
              value={formData.physicalActivity}
              onChange={handleInputChange}
              options={yesNoOptions}
              hint="Regular exercise or physical activity"
            />
            <SelectField
              label="Difficulty Walking"
              name="diffWalking"
              value={formData.diffWalking}
              onChange={handleInputChange}
              options={yesNoOptions}
              hint="Difficulty walking or climbing stairs"
            />
          </FormSection>

          <FormSection
            title="Health Status"
            icon={ActivitySquare}
            color="purple"
            visible={currentStep === 2}
          >
            <SelectField
              label="General Health"
              name="genHealth"
              value={formData.genHealth}
              onChange={handleInputChange}
              options={genHealthOptions}
              hint="Overall health self-assessment"
            />
            <NumberField
              label="Physical Health"
              name="physicalHealth"
              value={formData.physicalHealth}
              onChange={handleInputChange}
              min={0}
              max={30}
              hint="Days of poor physical health (last 30 days)"
            />
            <NumberField
              label="Mental Health"
              name="mentalHealth"
              value={formData.mentalHealth}
              onChange={handleInputChange}
              min={0}
              max={30}
              hint="Days of poor mental health (last 30 days)"
            />
          </FormSection>

          <FormSection
            title="Medical History"
            icon={Stethoscope}
            color="red"
            visible={currentStep === 3}
          >
            <SelectField
              label="Heart Disease"
              name="heartDisease"
              value={formData.heartDisease}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <SelectField
              label="Previous Stroke"
              name="stroke"
              value={formData.stroke}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <SelectField
              label="Diabetic"
              name="diabetic"
              value={formData.diabetic}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <SelectField
              label="Asthma"
              name="asthma"
              value={formData.asthma}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <SelectField
              label="Kidney Disease"
              name="kidneyDisease"
              value={formData.kidneyDisease}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
            <SelectField
              label="Skin Cancer"
              name="skinCancer"
              value={formData.skinCancer}
              onChange={handleInputChange}
              options={yesNoOptions}
            />
          </FormSection>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              type="button"
              onClick={handlePrevStep}
              className={`
                flex items-center gap-2 py-3 px-6 rounded-xl
                transition-all duration-200
                ${currentStep === 0
                  ? 'opacity-0 cursor-default'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }
              `}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep === FORM_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="
                  flex items-center justify-center gap-2 
                  py-3 px-8 
                  bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600
                  hover:from-blue-700 hover:via-blue-800 hover:to-purple-700
                  text-white text-lg font-semibold 
                  rounded-xl shadow-lg shadow-blue-500/25
                  hover:shadow-xl hover:shadow-blue-500/30
                  transform hover:scale-[1.02]
                  transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  min-w-[200px]
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Risk Factors
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextStep}
                className="
                  flex items-center justify-center gap-2 
                  py-3 px-8 
                  bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600
                  hover:from-blue-700 hover:via-blue-800 hover:to-purple-700
                  text-white text-lg font-semibold 
                  rounded-xl shadow-lg shadow-blue-500/25
                  hover:shadow-xl hover:shadow-blue-500/30
                  transform hover:scale-[1.02]
                  transition-all duration-200 
                  min-w-[200px]
                "
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {prediction !== null && riskFactors.length > 0 && (
          <div className="mt-16 transform transition-all duration-500 ease-out">
            <RiskFactorsAnalysis
              prediction={prediction}
              riskFactors={riskFactors}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;