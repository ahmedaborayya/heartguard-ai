import React from 'react';
import { ArrowRight, Heart, Brain, Activity, Shield, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC = () => (
  <div>
    {/* Hero Section */}
    <section className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90 z-10" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')] bg-cover bg-center" />
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 backdrop-blur-sm px-4 py-2 rounded-full text-blue-100 mb-6">
            <Shield className="w-4 h-4" />
            <span>AI-Powered Heart Health Monitoring</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Predict Heart Failure Risk <br />with Advanced AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Early detection for better prevention using state-of-the-art machine learning algorithms and comprehensive health analysis
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth">
              <Button variant="secondary" className="text-lg px-8 py-3">
                Get Started <ArrowRight className="inline-block ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" className="text-lg px-8 py-3 text-white bg-white/10 hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HeartGuard AI?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines medical expertise with advanced AI to provide accurate heart health predictions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Brain}
            title="AI-Powered Analysis"
            description="Advanced machine learning algorithms analyze multiple health factors to predict heart failure risk"
          />
          <FeatureCard
            icon={Activity}
            title="Real-time Monitoring"
            description="Track your heart health metrics and receive personalized recommendations"
          />
          <FeatureCard
            icon={BarChart3}
            title="Detailed Insights"
            description="Get comprehensive reports and trends analysis of your heart health over time"
          />
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <p className="text-gray-600">Prediction Accuracy</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
            <p className="text-gray-600">Health Assessments</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-600">Health Monitoring</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Heart Health?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust HeartGuard AI for early heart disease detection and prevention
        </p>
        <Link to="/auth">
          <Button variant="secondary" className="text-lg px-8 py-3">
            Start Free Assessment <ArrowRight className="inline-block ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  </div>
);

export default LandingPage; 