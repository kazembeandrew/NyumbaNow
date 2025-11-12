
import React from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Property } from '../types';
import { HouseIcon, HeartIcon, MessageSquareIcon, UserIcon, MapPinIcon, BedIcon, BathIcon, ChevronLeftIcon, BellIcon, PlusCircleIcon } from '../constants';

// --- Button Component ---
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseClasses = "w-full py-3 rounded-lg font-heading font-semibold transition-colors duration-300 text-center";
  const primaryClasses = "bg-primary text-white hover:bg-green-700";
  const outlineClasses = "bg-transparent border-2 border-primary text-primary hover:bg-primary/10";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses} ${className}`}>
      {children}
    </button>
  );
};

// --- Property Card Component ---
interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer transition-transform hover:scale-105">
      <img src={property.imageUrl} alt={property.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary">{property.title}</h3>
        <p className="font-heading text-primary font-bold text-md my-1">MK {property.price.toLocaleString()}/month</p>
        <div className="flex items-center text-text-secondary text-sm mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center text-text-secondary text-sm space-x-4">
          <div className="flex items-center">
            <BedIcon className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <BathIcon className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Recommended Property Card Component ---
export const RecommendedPropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div onClick={onClick} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105">
      <img src={property.imageUrl} alt={property.title} className="w-full h-32 object-cover" />
      <div className="p-3">
        <h3 className="font-heading text-base font-semibold text-text-primary truncate">{property.title}</h3>
        <p className="font-heading text-primary font-bold text-sm my-1">MK {property.price.toLocaleString()}/month</p>
        <div className="flex items-center text-text-secondary text-xs">
          <MapPinIcon className="w-3 h-3 mr-1" />
          <span className="truncate">{property.location}</span>
        </div>
      </div>
    </div>
  );
};


// --- Header Component ---
interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction }) => {
  return (
    <div className="sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 p-4 flex items-center justify-between border-b border-border-soft">
      <div className="w-8">
        {onBack && (
          <button onClick={onBack} className="text-text-primary">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <h1 className="font-heading text-lg font-semibold text-text-primary text-center">{title}</h1>
      <div className="w-8">{rightAction}</div>
    </div>
  );
};


// --- Bottom Navigation Bar ---
export const BottomNavBar: React.FC = () => {
    const { currentScreen, setCurrentScreen, userRole } = useAppContext();

    const getNavItems = () => {
        switch (userRole) {
            case UserRole.TENANT:
                return [
                    { screen: Screen.TENANT_HOME, icon: HouseIcon, label: 'Home' },
                    { screen: Screen.FAVORITES, icon: HeartIcon, label: 'Favorites' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Messages' },
                    { screen: Screen.TENANT_PROFILE, icon: UserIcon, label: 'Profile' },
                ];
            case UserRole.LANDLORD:
                return [
                    { screen: Screen.LANDLORD_DASHBOARD, icon: HouseIcon, label: 'Dashboard' },
                    { screen: Screen.MANAGE_PROPERTIES, icon: PlusCircleIcon, label: 'Properties' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Messages' },
                    { screen: Screen.TENANT_PROFILE, icon: UserIcon, label: 'Profile' },
                ];
            case UserRole.AGENT:
                return [
                    { screen: Screen.AGENT_DASHBOARD, icon: HouseIcon, label: 'Dashboard' },
                    { screen: Screen.AGENT_PROPERTY_MANAGEMENT, icon: PlusCircleIcon, label: 'Manage' },
                    { screen: Screen.AGENT_PROFILE, icon: UserIcon, label: 'Profile' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    const handleNav = (screen: Screen) => {
        setCurrentScreen(screen);
    };

    return (
        <div className="bg-white border-t border-border-soft flex justify-around p-2">
            {navItems.map(({ screen, icon: Icon, label }) => {
                const isActive = currentScreen === screen;
                return (
                    <button key={label} onClick={() => handleNav(screen)} className="flex flex-col items-center justify-center w-16 h-16 transition-colors">
                        <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-text-secondary'}`} />
                        <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{label}</span>
                    </button>
                );
            })}
        </div>
    );
};
