import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Property } from '../types';
import { MOCK_PROPERTIES, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, NyumbaNowLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, MapIcon, ListIcon } from '../constants';
import { Button, PropertyCard, Header, RecommendedPropertyCard } from './ui';

// --- Screen Components ---

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen(Screen.LOGIN);
    }, 3000); // Increased timer to allow animation to complete
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-hidden">
        <div className="w-24 h-24 mb-4">
            <svg className="w-full h-full splash-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="transparent" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#009639"></path>
                <polyline points="9 22 9 12 15 12 15 22" stroke="#009639"></polyline>
            </svg>
        </div>
      <h1 id="splash-title" className="text-4xl font-bold font-heading text-text-primary splash-text">NyumbaNow</h1>
      <p id="splash-subtitle" className="text-lg text-text-secondary mt-2 splash-text">Find your home today</p>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="p-8 flex flex-col justify-center h-full bg-secondary">
            <h1 className="font-heading text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-text-secondary mb-8">Enter your phone number to continue.</p>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                <input 
                    type="tel" 
                    id="phone" 
                    placeholder="+265 123 456 789" 
                    className="w-full px-4 py-3 rounded-lg border border-border-soft focus:ring-primary focus:border-primary"
                />
            </div>
            <Button onClick={() => setCurrentScreen(Screen.ROLE_SELECTION)}>Continue</Button>
            <p className="text-center text-sm text-text-secondary mt-6">
                Don't have an account? <a href="#" className="font-semibold text-primary">Register</a>
            </p>
        </div>
    );
};

export const RoleSelectionScreen: React.FC = () => {
    const { setUserRole, setCurrentScreen } = useAppContext();
    const selectRole = (role: UserRole) => {
        setUserRole(role);
        switch (role) {
            case UserRole.TENANT:
                setCurrentScreen(Screen.TENANT_HOME);
                break;
            case UserRole.LANDLORD:
                setCurrentScreen(Screen.LANDLORD_DASHBOARD);
                break;
            case UserRole.AGENT:
                setCurrentScreen(Screen.AGENT_DASHBOARD);
                break;
        }
    };

    return (
        <div className="p-8 flex flex-col justify-center h-full bg-secondary">
            <h1 className="font-heading text-2xl font-bold text-center mb-2">Choose Your Role</h1>
            <p className="text-text-secondary text-center mb-8">How will you be using NyumbaNow?</p>
            <div className="space-y-4">
                <Button onClick={() => selectRole(UserRole.TENANT)}>I'm a Tenant</Button>
                <Button onClick={() => selectRole(UserRole.LANDLORD)} variant="outline">I'm a Landlord</Button>
                <Button onClick={() => selectRole(UserRole.AGENT)} variant="outline">I'm an Agent</Button>
            </div>
        </div>
    );
};

const MOCK_COORDINATES = [
    { top: '20%', left: '30%' },
    { top: '50%', left: '70%' },
    { top: '75%', left: '25%' },
    { top: '35%', left: '55%' },
];

const MapView: React.FC = () => {
    const { setSelectedProperty, setCurrentScreen } = useAppContext();
    const [activeProperty, setActiveProperty] = useState<Property | null>(null);

    const handlePinClick = (property: Property) => {
        setActiveProperty(property);
    };
    
    const handleCardClick = (property: Property) => {
        setSelectedProperty(property);
        setCurrentScreen(Screen.PROPERTY_DETAILS);
    }

    return (
        <div className="flex-grow h-full relative">
            <div className="absolute inset-0 bg-gray-200">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/003/399/485/small/map-of-the-city-with-streets-and-districts-vector.jpg" className="w-full h-full object-cover opacity-50" alt="City Map"/>
            </div>
            
            {MOCK_PROPERTIES.map((property, index) => (
                <button 
                    key={property.id} 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={MOCK_COORDINATES[index % MOCK_COORDINATES.length]}
                    onClick={() => handlePinClick(property)}
                    aria-label={`View details for ${property.title}`}
                >
                    <div className={`p-1 rounded-full shadow-lg transition-transform ${activeProperty?.id === property.id ? 'bg-primary scale-125' : 'bg-white'}`}>
                        <MapPinIcon className={`w-5 h-5 ${activeProperty?.id === property.id ? 'text-white' : 'text-primary'}`} />
                    </div>
                </button>
            ))}
            
            {activeProperty && (
                <div className="absolute bottom-4 left-4 right-4 z-10 animate-fade-in-up">
                   <RecommendedPropertyCard property={activeProperty} onClick={() => handleCardClick(activeProperty)} />
                </div>
            )}
        </div>
    );
};

export const TenantHomeScreen: React.FC = () => {
  const { setCurrentScreen, setSelectedProperty } = useAppContext();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setCurrentScreen(Screen.PROPERTY_DETAILS);
  };
  
  const recommendedProperties = MOCK_PROPERTIES.slice(0, 3);

  return (
    <div className="bg-secondary min-h-full flex flex-col">
      <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <input type="text" placeholder="Search location or price" className="w-full pl-10 pr-4 py-2 rounded-full border border-border-soft" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} 
                className="p-2 bg-white rounded-full shadow border border-border-soft hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label={viewMode === 'list' ? 'Switch to map view' : 'Switch to list view'}
            >
                {viewMode === 'list' ? <MapIcon className="w-5 h-5 text-text-primary" /> : <ListIcon className="w-5 h-5 text-text-primary" />}
            </button>
        </div>
        <div className="flex space-x-2 mt-4">
          {['Location', 'Price', 'Bedrooms'].map(filter => (
            <button key={filter} className="px-4 py-1 bg-white border border-border-soft rounded-full text-sm text-text-secondary">{filter}</button>
          ))}
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="overflow-y-auto">
            <div className="py-4">
                <h2 className="font-heading text-xl font-semibold text-text-primary px-4 mb-3">Recommended for You</h2>
                <div className="flex overflow-x-auto space-x-4 px-4 pb-2 scrollbar-hide">
                {recommendedProperties.map(prop => (
                    <RecommendedPropertyCard key={prop.id} property={prop} onClick={() => handlePropertyClick(prop)} />
                ))}
                </div>
            </div>

            <div className="px-4">
                <h2 className="font-heading text-xl font-semibold text-text-primary mb-3">All Properties</h2>
                {MOCK_PROPERTIES.map(property => (
                <PropertyCard key={property.id} property={property} onClick={() => handlePropertyClick(property)} />
                ))}
            </div>
        </div>
      ) : (
        <MapView />
      )}
    </div>
  );
};


export const PropertyDetailsScreen: React.FC = () => {
    const { selectedProperty, setCurrentScreen } = useAppContext();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    useEffect(() => {
        if (!selectedProperty) {
            setCurrentScreen(Screen.TENANT_HOME);
        }
    }, [selectedProperty, setCurrentScreen]);

    if (!selectedProperty) {
        return null; // Or a loading/error state
    }
    
    const images = selectedProperty.images.length > 0 ? selectedProperty.images : [selectedProperty.imageUrl];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        // Threshold for swipe detection
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swiped left
                nextImage();
            } else {
                // Swiped right
                prevImage();
            }
        }
        setTouchStartX(null);
    };

    return (
        <div className="bg-secondary min-h-full">
            <div 
                className="relative w-full h-64 bg-gray-200"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <img 
                    src={images[currentImageIndex]} 
                    alt={`${selectedProperty.title} ${currentImageIndex + 1}`} 
                    className="w-full h-full object-cover select-none"
                    aria-live="polite"
                />
                
                <button onClick={() => setCurrentScreen(Screen.TENANT_HOME)} className="absolute top-4 left-4 bg-black/40 p-2 rounded-full text-white z-10" aria-label="Back to home">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                
                <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white z-10" aria-label="Toggle favorite">
                    <HeartIcon className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 stroke-red-500' : ''}`} />
                </button>

                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-1 rounded-full text-white z-10" aria-label="Previous image">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-1 rounded-full text-white z-10" aria-label="Next image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10" role="tablist" aria-label="Image gallery controls">
                            {images.map((_, index) => (
                                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} aria-selected={index === currentImageIndex} role="tab"></button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-text-primary">{selectedProperty.title}</h1>
                        <div className="flex items-center text-text-secondary text-base mt-1">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span>{selectedProperty.location}</span>
                        </div>
                    </div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded ${selectedProperty.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedProperty.status}
                    </div>
                </div>

                <p className="font-heading text-primary font-bold text-2xl my-4">MK {selectedProperty.price.toLocaleString()}/month</p>

                <div className="flex items-center text-text-secondary text-base space-x-6 border-y border-border-soft py-3">
                    <div className="flex items-center">
                        <BedIcon className="w-5 h-5 mr-2 text-primary" />
                        <span>{selectedProperty.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                        <BathIcon className="w-5 h-5 mr-2 text-primary" />
                        <span>{selectedProperty.bathrooms} Bathrooms</span>
                    </div>
                </div>

                <div className="mt-4">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Description</h2>
                    <p className="text-text-secondary">{selectedProperty.description}</p>
                </div>
                
                 <div className="mt-4">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Landlord/Agent</h2>
                    <div className="flex items-center bg-white p-3 rounded-lg">
                        <UserIcon className="w-10 h-10 text-text-secondary bg-gray-200 p-2 rounded-full mr-3"/>
                        <div>
                            <p className="font-semibold text-text-primary">{selectedProperty.landlordName}</p>
                            <p className="text-sm text-text-secondary">Landlord</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t border-border-soft flex space-x-3">
                <Button onClick={() => setCurrentScreen(Screen.MESSAGES)} variant="outline">Message</Button>
                <Button onClick={() => {}}>Request a Tour</Button>
            </div>
        </div>
    );
};


// --- Placeholder Screens ---
const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
    <div>
        <Header title={title} onBack={() => window.history.back()} />
        <div className="p-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p>This screen is under construction.</p>
        </div>
    </div>
);

export const FavoritesScreen: React.FC = () => <PlaceholderScreen title="Favorites" />;
export const MessagesScreen: React.FC = () => <PlaceholderScreen title="Messages" />;
export const TenantProfileScreen: React.FC = () => <PlaceholderScreen title="Profile" />;
export const LandlordDashboardScreen: React.FC = () => <PlaceholderScreen title="Landlord Dashboard" />;
export const AddPropertyScreen: React.FC = () => <PlaceholderScreen title="Add Property" />;
export const ManagePropertiesScreen: React.FC = () => <PlaceholderScreen title="Manage Properties" />;
export const AgentDashboardScreen: React.FC = () => <PlaceholderScreen title="Agent Dashboard" />;
export const AgentProfileScreen: React.FC = () => <PlaceholderScreen title="Agent Profile" />;
export const AgentPropertyManagementScreen: React.FC = () => <PlaceholderScreen title="Property Management" />;
export const NotificationsScreen: React.FC = () => <PlaceholderScreen title="Notifications" />;
export const RulesAndPoliciesScreen: React.FC = () => <PlaceholderScreen title="Rules & Policies" />;
export const SettingsScreen: React.FC = () => <PlaceholderScreen title="Settings" />;
export const AboutScreen: React.FC = () => <PlaceholderScreen title="About" />;