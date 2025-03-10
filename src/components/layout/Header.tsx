import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Bell,
  Brain,
  Clock,
  BarChart3,
  Home,
  LucideIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import NotificationDropdown from '../notifications/NotificationDropdown';

type NavigationItem = {
  path: string;
  label: string;
  icon?: LucideIcon;
  state?: { activeTab: string };
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
    }
    return location.pathname.startsWith(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  // Navigation items based on auth state
  const navigationItems: NavigationItem[] = user ? [
    { path: '/', label: 'Dashboard' },
    { path: '/predict', label: 'Assessment' },
    { path: '/profile', label: 'History', state: { activeTab: 'history' } },
    { path: '/about', label: 'About' }
  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">HeartGuard</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                state={item.state}
                className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section: Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* Notifications - Only show for authenticated users */}
            {user && (
              <div ref={notificationRef} className="relative">
                <button 
                  className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={isNotificationsOpen} 
                  onClose={() => setIsNotificationsOpen(false)} 
                />
              </div>
            )}

            {/* Profile or Sign In */}
            {user ? (
              <Link 
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            ) : (
              <Link 
                to="/auth"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden
            absolute left-0 right-0 top-16 
            bg-white border-b border-gray-200
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          `}
        >
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                state={item.state}
                className={`block px-3 py-2 rounded-lg text-sm ${isActive(item.path)} hover:bg-gray-50`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;