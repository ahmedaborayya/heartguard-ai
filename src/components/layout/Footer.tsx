import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="text-gray-500 hover:text-blue-600 transition-colors"
  >
    {children}
  </Link>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white/80 p-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
  >
    <Icon className="w-5 h-5" />
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HeartGuard</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Empowering healthcare with AI-driven heart disease prediction technology.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon href="https://github.com" icon={Github} />
                <SocialIcon href="https://twitter.com" icon={Twitter} />
                <SocialIcon href="https://linkedin.com" icon={Linkedin} />
              </div>
            </div>

            {/* Navigation Section */}
            <div className="md:flex md:justify-center">
              <div>
                <h3 className="text-gray-900 font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  <li><FooterLink to="/">Home</FooterLink></li>
                  <li><FooterLink to="/about">About</FooterLink></li>
                  <li><FooterLink to="/predict">Assessment</FooterLink></li>
                </ul>
              </div>
            </div>

            {/* Legal Section */}
            <div className="md:flex md:justify-end">
              <div>
                <h3 className="text-gray-900 font-semibold mb-6">Legal</h3>
                <ul className="space-y-4">
                  <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                  <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            © {new Date().getFullYear()} HeartGuard AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;