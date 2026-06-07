import React, { useState } from 'react';
import { 
  Users, 
  Building,
  UtensilsCrossed,
  Car,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { vendor, logout } = useAuth();

  // Dynamic menu items based on vendor business type
  const getMenuItems = () => {
    const items = [
      {
        title: 'My Bookings',
        path: '/customer-query',
        icon: Users,
        description: 'View customer bookings'
      }
    ];

    // Add onboarding based on business type
    if (vendor?.businessType === 'Hotel') {
      items.push({
        title: 'Hotel Onboarding',
        path: '/hotel-onboarding',
        icon: Building,
        description: 'Manage hotel listings'
      });
    } else if (vendor?.businessType === 'Restaurant') {
      items.push({
        title: 'Restaurant Onboarding',
        path: '/restaurant-onboarding',
        icon: UtensilsCrossed,
        description: 'Manage restaurant listings'
      });
    } else if (vendor?.businessType === 'Transport') {
      items.push({
        title: 'Transport Onboarding',
        path: '/transport-onboarding',
        icon: Car,
        description: 'Manage transport services'
      });
    } else if (vendor?.businessType === 'Trip Organizer') {
      items.push({
        title: 'Trip Organizer Onboarding',
        path: '/trip-organizer-onboarding',
        icon: MapPin,
        description: 'Manage trip services'
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <div className={`bg-[#2F4157] text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-screen flex flex-col shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-[#4F7F96]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">TourEx Vendor</h1>
              <p className="text-sm text-gray-300">{vendor?.businessType} Panel</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#4F7F96] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-[#4F7F96] text-white shadow-lg' 
                      : 'hover:bg-[#3a5a73] text-gray-300 hover:text-white'
                  }`}
                  title={isCollapsed ? item.title : ''}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="text-xs opacity-75">{item.description}</span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#4F7F96] space-y-3">
        {/* User Info */}
        {!isCollapsed && vendor && (
          <div className="flex items-center gap-3 p-2 bg-[#3a5a73] rounded-lg">
            <div className="w-8 h-8 bg-[#4F7F96] rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{vendor.businessName || vendor.email}</p>
              <p className="text-xs text-gray-300">{vendor.businessType || 'Vendor'}</p>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition-colors group text-gray-300 hover:text-white"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>

        {/* Footer */}
        {!isCollapsed && (
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">© 2025 TourEx Vendor</p>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
