
import React from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Review } from '../types';
import { HouseIcon, HeartIcon, MessageSquareIcon, UserIcon, MapPinIcon, BedIcon, BathIcon, ChevronLeftIcon, BellIcon, PlusCircleIcon, StarIcon, ListIcon } from '../constants';

// --- Button Component ---
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = "w-full py-3 rounded-lg font-heading font-semibold transition-colors duration-300 text-center disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryClasses = "bg-primary text-white hover:bg-green-700";
  const outlineClasses = "bg-transparent border-2 border-primary text-primary hover:bg-primary/10";

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses} ${className}`}>
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
  const priceSuffix = listing.priceType === 'per month' ? '/month' : listing.priceType === 'per day' ? '/day' : '';
  
  return (
    <div onClick={onClick} className="bg-white rounded-lg shadow-md overflow-hidden mb-4 cursor-pointer transition-transform hover:scale-105">
      <img src={listing.imageUrl} alt={listing.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary">{listing.title}</h3>
        <p className="font-heading text-primary font-bold text-md my-1">MK {listing.price.toLocaleString()}{priceSuffix}</p>
        <div className="flex items-center text-text-secondary text-sm mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span>{listing.location}</span>
        </div>
        {(listing.bedrooms || listing.bathrooms) && (
            <div className="flex items-center text-text-secondary text-sm space-x-4">
            {listing.bedrooms && (
                <div className="flex items-center">
                    <BedIcon className="w-4 h-4 mr-1" />
                    <span>{listing.bedrooms} Beds</span>
                </div>
            )}
            {listing.bathrooms && (
                <div className="flex items-center">
                    <BathIcon className="w-4 h-4 mr-1" />
                    <span>{listing.bathrooms} Baths</span>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

// --- Recommended Listing Card Component ---
export const RecommendedListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const priceSuffix = listing.priceType === 'per month' ? '/month' : listing.priceType === 'per day' ? '/day' : '';
  return (
    <div onClick={onClick} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105">
      <img src={listing.imageUrl} alt={listing.title} className="w-full h-32 object-cover" />
      <div className="p-3">
        <h3 className="font-heading text-base font-semibold text-text-primary truncate">{listing.title}</h3>
        <p className="font-heading text-primary font-bold text-sm my-1">MK {listing.price.toLocaleString()}{priceSuffix}</p>
        <div className="flex items-center text-text-secondary text-xs">
          <MapPinIcon className="w-3 h-3 mr-1" />
          <span className="truncate">{listing.location}</span>
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
            case UserRole.BUYER:
                return [
                    { screen: Screen.HOME_SCREEN, icon: HouseIcon, label: 'Home' },
                    { screen: Screen.FAVORITES, icon: HeartIcon, label: 'Favorites' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Messages' },
                    { screen: Screen.PROFILE, icon: UserIcon, label: 'Profile' },
                ];
            case UserRole.SELLER:
                return [
                    { screen: Screen.DASHBOARD, icon: HouseIcon, label: 'Dashboard' },
                    { screen: Screen.MANAGE_LISTINGS, icon: ListIcon, label: 'Listings' },
                    { screen: Screen.MESSAGES, icon: MessageSquareIcon, label: 'Messages' },
                    { screen: Screen.PROFILE, icon: UserIcon, label: 'Profile' },
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

// --- Star Rating Component ---
interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, className = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(totalStars)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-4 h-4 ${index < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
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
        <div className="flex items-start space-x-4 py-4">
            <img 
                src={review.authorImageUrl || 'https://picsum.photos/seed/avatar/100'} 
                alt={review.authorName} 
                className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-text-primary">{review.authorName}</p>
                        <p className="text-xs text-text-secondary">{review.timestamp}</p>
                    </div>
                    <StarRating rating={review.rating} />
                </div>
                <p className="text-text-secondary mt-2 text-sm">{review.comment}</p>
            </div>
        </div>
    );
};