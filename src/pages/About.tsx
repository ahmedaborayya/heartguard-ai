import React from 'react';
import { Heart, Brain, Activity, Shield, Users, BarChart3, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
    <div className="aspect-w-3 aspect-h-4">
      <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  </div>
);

const TechnologyCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl">
    <div className="mb-4 inline-block rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-24 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Trusted by Healthcare Professionals</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">About HeartGuard AI</h1>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                Revolutionizing heart disease prevention through cutting-edge artificial intelligence and making early detection accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                <Heart className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Making Heart Health <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Predictable and Preventable
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                HeartGuard AI is dedicated to revolutionizing heart disease prevention through 
                cutting-edge artificial intelligence. Our mission is to make early detection 
                accessible to everyone, everywhere.
              </p>
              <ul className="space-y-3">
                {[
                  'Advanced AI-powered predictions',
                  'Real-time health monitoring',
                  'Personalized risk assessments',
                  'Early detection capabilities'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/predict">
                  <Button variant="primary" className="group">
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Medical professionals"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              <Brain className="h-4 w-4" />
              Our Technology
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              The Technology Behind Our Predictions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our AI model is trained on extensive medical data and validated by healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TechnologyCard
              icon={Brain}
              title="AI Analysis"
              description="Advanced machine learning algorithms analyze multiple health factors for accurate predictions."
            />
            <TechnologyCard
              icon={Activity}
              title="Real-time Monitoring"
              description="Continuous health tracking and instant alerts for any concerning changes."
            />
            <TechnologyCard
              icon={BarChart3}
              title="Data Processing"
              description="Processing millions of health records to identify patterns and risks."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { number: '95%', label: 'Prediction Accuracy' },
              { number: '10k+', label: 'Predictions Made' },
              { number: '50+', label: 'Healthcare Partners' }
            ].map((stat) => (
              <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 transition-transform duration-300 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-2 text-5xl font-bold text-blue-600">{stat.number}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              <Users className="h-4 w-4" />
              Our Team
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Meet the Experts Behind HeartGuard
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our team combines expertise in cardiology, artificial intelligence, and healthcare technology.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <TeamMember
              name="Dr. Sarah Chen"
              role="Chief Medical Officer"
              image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            />
            <TeamMember
              name="Dr. Michael Roberts"
              role="AI Research Director"
              image="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            />
            <TeamMember
              name="Dr. Emily Thompson"
              role="Lead Cardiologist"
              image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;