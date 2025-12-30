
import React from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Review } from '../types';
import { HouseIcon, HeartIcon, MessageSquareIcon, UserIcon, MapPinIcon, BedIcon, BathIcon, ChevronLeftIcon, BellIcon, PlusCircleIcon, StarIcon, ListIcon, ShieldCheckIcon, SunIcon, ClockIcon, CheckCircleIcon, DropletsIcon } from '../constants';
import { getOptimizedImageUrl } from '../utils/images';

// --- Skeleton Loader ---
export const ListingSkeleton = () => (
    <div className="bg-white rounded-2xl border border-border-soft overflow-hidden mb-4 animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            <div className="h-10 bg-gray-50 rounded-xl"></div>
        </div>
    </div>
);

// --- Button Component ---
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'success';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = "w-full py-4 rounded-[24px] font-heading font-bold transition-all duration-300 text-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const primaryClasses = "bg-primary text-white hover:bg-blue-700 shadow-xl shadow-primary/20";
  const successClasses = "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-500/20";
  const outlineClasses = "bg-transparent border-2 border-primary text-primary hover:bg-primary/5";

  const getVariantClass = () => {
    if (variant === 'primary') return primaryClasses;
    if (variant === 'success') return successClasses;
    return outlineClasses;
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${getVariantClass()} ${className}`}>
      {children}
    </button>
  );
};

// --- Listing Card Component ---
interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div 
        onClick={onClick} 
        className={`bg-white rounded-2xl shadow-sm border overflow-hidden mb-4 cursor-pointer transition-all active:scale-95 group ${listing.is_promoted ? 'border-amber-400 ring-1 ring-amber-100 shadow-amber-50' : 'border-border-soft'}`}
    >
      <div className="relative h-48 bg-gray-100">
        <img 
            src={getOptimizedImageUrl(listing.imageUrl, 600)} 
            alt={listing.title} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 flex gap-2">
            {listing.isVerified && (
                <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-primary/20">
                    <ShieldCheckIcon className="w-3 h-3" /> VERIFIED
                </span>
            )}
            {listing.is_promoted && (
                <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <SunIcon className="w-3 h-3 fill-current" /> FEATURED
                </span>
            )}
        </div>
        <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
            MK {listing.price.toLocaleString()}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-text-primary mb-1 truncate">{listing.title}</h3>
        <div className="flex items-center text-text-secondary text-xs mb-3">
          <MapPinIcon className="w-3.5 h-3.5 mr-1 text-primary" />
          <span className="truncate">{listing.location}</span>
        </div>
        
        <div className="flex items-center gap-4 text-text-secondary text-xs font-medium bg-secondary/50 p-2 rounded-xl">
            <div className="flex items-center">
                <BedIcon className="w-3.5 h-3.5 mr-1.5 text-primary" />
                <span>{listing.bedrooms || 0} Beds</span>
            </div>
            <div className="flex items-center">
                <BathIcon className="w-3.5 h-3.5 mr-1.5 text-primary" />
                <span>{listing.bathrooms || 0} Baths</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Star Rating Component ---
interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, className = '' }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
};

// --- Review Card Component ---
interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-2xl border border-border-soft">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm">{review.authorName}</span>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-xs text-text-secondary italic mb-2">"{review.comment}"</p>
      <span className="text-[10px] text-gray-400 uppercase font-bold">{review.timestamp}</span>
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
    <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-border-soft">
      <div className="w-8">
        {onBack && (
          <button onClick={onBack} className="text-text-primary p-2 bg-secondary rounded-full">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="font-heading text-lg font-bold text-text-primary text-center flex-grow">{title}</h1>
      <div className="w-8">{rightAction}</div>
    </div>
  );
};


// --- Bottom Navigation Bar ---
export const BottomNavBar: React.FC = () => {
    const { currentScreen, setCurrentScreen, userRole } = useAppContext();

    const getNavItems = () => {
        switch (userRole) {
            case UserRole.BUYER:
                return [
                    { screen: Screen.HOME_SCREEN, icon: HouseIcon, label: 'Explore' },
                    { screen: Screen.FAVORITES, icon: HeartIcon, label: 'Saved' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Chats' },
                    { screen: Screen.PROFILE, icon: UserIcon, label: 'Me' },
                ];
            case UserRole.SELLER:
                return [
                    { screen: Screen.DASHBOARD, icon: HouseIcon, label: 'Hub' },
                    { screen: Screen.MANAGE_LISTINGS, icon: ListIcon, label: 'My Units' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Leads' },
                    { screen: Screen.PROFILE, icon: UserIcon, label: 'Me' },
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
        <div className="bg-white border-t border-border-soft flex justify-around p-3 pb-6 shadow-2xl">
            {navItems.map(({ screen, icon: Icon, label }) => {
                const isActive = (currentScreen === screen) || (screen === Screen.DASHBOARD && currentScreen === Screen.MANAGE_LISTINGS);
                return (
                    <button key={label} onClick={() => handleNav(screen)} className="flex flex-col items-center justify-center transition-all">
                        <Icon className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                        {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
                    </button>
                );
            })}
        </div>
    );
};
