
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Property } from '../types';
import { MOCK_PROPERTIES, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, NyumbaNowLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, MapIcon, ListIcon, PhoneIcon, SendIcon, ChevronRightIcon, SettingsIcon, FileTextIcon, InfoIcon, LogOutIcon, PlusCircleIcon, CameraIcon, BuildingIcon, CalendarIcon, LoaderIcon, ArrowDownIcon, ShareIcon } from '../constants';
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
    const { setCurrentScreen, setIsAuthenticated } = useAppContext();
    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentScreen(Screen.ROLE_SELECTION);
    };
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
            <Button onClick={handleLogin}>Continue</Button>
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
    const { setCurrentScreen, setSelectedProperty, isAuthenticated } = useAppContext();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [properties, setProperties] = useState(MOCK_PROPERTIES);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullPosition, setPullPosition] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pullStartRef = useRef<number | null>(null);

    const PULL_THRESHOLD = 80;
    const PULL_RESISTANCE = 0.5;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (scrollRef.current && scrollRef.current.scrollTop === 0) {
            pullStartRef.current = e.touches[0].clientY;
        } else {
            pullStartRef.current = null;
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (pullStartRef.current === null || isRefreshing) return;

        const touchY = e.touches[0].clientY;
        const pullDelta = touchY - pullStartRef.current;

        if (pullDelta > 0) {
            e.preventDefault();
            const newPullPosition = Math.min(pullDelta * PULL_RESISTANCE, PULL_THRESHOLD + 40);
            setPullPosition(newPullPosition);
        }
    };

    const handleTouchEnd = () => {
        if (pullStartRef.current === null || isRefreshing) return;
        pullStartRef.current = null;

        if (pullPosition >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            setPullPosition(60);

            setTimeout(() => {
                const shuffled = [...properties].sort(() => Math.random() - 0.5);
                setProperties(shuffled);
                setIsRefreshing(false);
                setPullPosition(0);
            }, 1500);
        } else {
            setPullPosition(0);
        }
    };

    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
        setCurrentScreen(Screen.PROPERTY_DETAILS);
    };

    const recommendedProperties = properties.slice(0, 3);

    return (
        <div className="bg-secondary min-h-full flex flex-col">
            <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input type="text" placeholder="Search location or price" className="w-full pl-10 pr-4 py-2 rounded-full border border-border-soft" />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    {isAuthenticated ? (
                        <button 
                            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} 
                            className="p-2 bg-white rounded-full shadow border border-border-soft hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label={viewMode === 'list' ? 'Switch to map view' : 'Switch to list view'}
                        >
                            {viewMode === 'list' ? <MapIcon className="w-5 h-5 text-text-primary" /> : <ListIcon className="w-5 h-5 text-text-primary" />}
                        </button>
                    ) : (
                        <button 
                            onClick={() => setCurrentScreen(Screen.LOGIN)}
                            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors flex-shrink-0"
                        >
                            Login
                        </button>
                    )}
                </div>
                <div className="flex space-x-2 mt-4">
                    {['Location', 'Price', 'Bedrooms'].map(filter => (
                        <button key={filter} className="px-4 py-1 bg-white border border-border-soft rounded-full text-sm text-text-secondary">{filter}</button>
                    ))}
                </div>
            </div>
            
            {viewMode === 'list' ? (
                <div
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto scrollbar-hide"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={`transition-transform duration-300 relative ${pullStartRef.current !== null ? '!duration-0' : ''}`}
                        style={{ transform: `translateY(${pullPosition}px)` }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-center -translate-y-full pointer-events-none">
                            {isRefreshing ? (
                                <LoaderIcon className="w-6 h-6 text-primary animate-spin" />
                            ) : (
                                <ArrowDownIcon 
                                    className="w-6 h-6 text-text-secondary transition-transform duration-200"
                                    style={{ 
                                        opacity: Math.min(pullPosition / PULL_THRESHOLD, 1),
                                        transform: `rotate(${pullPosition >= PULL_THRESHOLD ? '180deg' : '0deg'})` 
                                    }}
                                />
                            )}
                        </div>
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
                            {properties.map(property => (
                                <PropertyCard key={property.id} property={property} onClick={() => handlePropertyClick(property)} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <MapView />
            )}
        </div>
    );
};


export const PropertyDetailsScreen: React.FC = () => {
    const { selectedProperty, setCurrentScreen, isAuthenticated } = useAppContext();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        if (!selectedProperty) {
            setCurrentScreen(Screen.TENANT_HOME);
        }
    }, [selectedProperty, setCurrentScreen]);

    useEffect(() => {
        setIsImageLoading(true);
    }, [currentImageIndex]);

    if (!selectedProperty) {
        return null; // Or a loading/error state
    }
    
    const handleActionClick = (action: () => void) => {
        if (isAuthenticated) {
            action();
        } else {
            setShowLoginModal(true);
        }
    };
    
    const handleCall = () => {
        if (selectedProperty?.phoneNumber) {
            window.location.href = `tel:${selectedProperty.phoneNumber}`;
        } else {
            alert('Phone number not available.');
        }
    };

    const handleShare = async () => {
        if (!selectedProperty) return;

        const shareData = {
            title: `Check out this property on NyumbaNow`,
            text: `${selectedProperty.title}\nLocation: ${selectedProperty.location}\nPrice: MK ${selectedProperty.price.toLocaleString()}/month`,
            url: `https://nyumbanow.app/property/${selectedProperty.id}` // Mock URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing property:', err);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            alert('Sharing is not supported on your browser. You can manually copy the link: ' + shareData.url);
        }
    };

    const handleMessage = () => setCurrentScreen(Screen.MESSAGES);
    const handleBookViewing = () => setShowBookingModal(true);

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

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        setTouchStartX(null);
    };

    const BookingConfirmationModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <h2 className="font-heading text-xl font-bold mb-2">Booking Request Sent</h2>
                <p className="text-text-secondary mb-6">The landlord/agent has been notified. They will contact you shortly to confirm the date and time.</p>
                <Button onClick={onClose}>Got it</Button>
            </div>
        </div>
    );
    
    const LoginRequiredModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <h2 className="font-heading text-xl font-bold mb-2">Login Required</h2>
                <p className="text-text-secondary mb-6">Please log in or register to contact the agent and book a viewing.</p>
                <Button onClick={() => {
                    onClose();
                    setCurrentScreen(Screen.LOGIN);
                }} className="mb-2">Login / Register</Button>
                <button onClick={onClose} className="text-sm text-text-secondary">Maybe Later</button>
            </div>
        </div>
    );


    const statusStyles: { [key: string]: string } = {
        Available: 'bg-green-100 text-green-800',
        Rented: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        'Under Maintenance': 'bg-blue-100 text-blue-800',
    };

    return (
        <div className="bg-secondary min-h-full">
            <div 
                className="relative w-full h-64 bg-gray-300"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-full animate-shimmer"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <NyumbaNowLogo className="w-12 h-12 text-gray-400/80" />
                        </div>
                    </div>
                )}
                <img 
                    src={images[currentImageIndex]} 
                    alt={`${selectedProperty.title} ${currentImageIndex + 1}`} 
                    className={`w-full h-full object-cover select-none transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                    aria-live="polite"
                />
                
                <button onClick={() => setCurrentScreen(Screen.TENANT_HOME)} className="absolute top-4 left-4 bg-black/40 p-2 rounded-full text-white z-10" aria-label="Back to home">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={handleShare} className="bg-black/40 p-2 rounded-full text-white" aria-label="Share property">
                        <ShareIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleActionClick(() => setIsFavorite(!isFavorite))} className="bg-black/40 p-2 rounded-full text-white" aria-label="Toggle favorite">
                        <HeartIcon className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 stroke-red-500' : ''}`} />
                    </button>
                </div>

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

            <div className="p-4 pb-24">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-text-primary">{selectedProperty.title}</h1>
                        <div className="flex items-center text-text-secondary text-base mt-1">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span>{selectedProperty.location}</span>
                        </div>
                    </div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded ${statusStyles[selectedProperty.status]}`}>
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
                    {isAuthenticated ? (
                        <div className="flex items-center bg-white p-3 rounded-lg">
                            <UserIcon className="w-10 h-10 text-text-secondary bg-gray-200 p-2 rounded-full mr-3"/>
                            <div>
                                <p className="font-semibold text-text-primary">{selectedProperty.landlordName}</p>
                                <p className="text-sm text-text-secondary">Landlord</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center bg-white p-3 rounded-lg">
                            <UserIcon className="w-10 h-10 text-text-secondary bg-gray-200 p-2 rounded-full mr-3"/>
                            <div>
                                <p className="font-semibold text-text-primary">Login to see agent details</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white p-4 border-t border-border-soft flex items-center gap-3">
                <button
                    onClick={() => handleActionClick(handleCall)}
                    className="p-3.5 border border-border-soft rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    aria-label="Call landlord"
                >
                    <PhoneIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => handleActionClick(handleMessage)}
                    className="p-3.5 border border-border-soft rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    aria-label="Message landlord"
                >
                    <MessageSquareIcon className="w-6 h-6" />
                </button>
                <Button onClick={() => handleActionClick(handleBookViewing)} className="flex-1 w-auto">
                    Book Viewing
                </Button>
            </div>
             {showBookingModal && <BookingConfirmationModal onClose={() => setShowBookingModal(false)} />}
             {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

export const MessagesScreen: React.FC = () => {
    const { setCurrentScreen, selectedProperty } = useAppContext();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullPosition, setPullPosition] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pullStartRef = useRef<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const PULL_THRESHOLD = 80;
    const PULL_RESISTANCE = 0.5;

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (scrollRef.current && scrollRef.current.scrollTop === 0) {
            pullStartRef.current = e.touches[0].clientY;
        } else {
            pullStartRef.current = null;
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (pullStartRef.current === null || isRefreshing) return;
        const touchY = e.touches[0].clientY;
        const pullDelta = touchY - pullStartRef.current;
        if (pullDelta > 0) {
            e.preventDefault();
            const newPullPosition = Math.min(pullDelta * PULL_RESISTANCE, PULL_THRESHOLD + 40);
            setPullPosition(newPullPosition);
        }
    };

    const handleTouchEnd = () => {
        if (pullStartRef.current === null || isRefreshing) return;
        pullStartRef.current = null;
        if (pullPosition >= PULL_THRESHOLD) {
            setIsRefreshing(true);
            setPullPosition(60);

            setTimeout(() => {
                const newReply = {
                    id: messages.length + 1,
                    sender: 'other' as const,
                    text: 'I have received your request. Let me check my schedule.',
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newReply]);
                setIsRefreshing(false);
                setPullPosition(0);
            }, 1500);
        } else {
            setPullPosition(0);
        }
    };

    const handleSend = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'me' as const,
                text: newMessage.trim(),
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };
    
    const contactName = selectedProperty?.landlordName || "Messages";
    const backScreen = selectedProperty ? Screen.PROPERTY_DETAILS : Screen.TENANT_HOME;

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title={contactName} onBack={() => setCurrentScreen(backScreen)} />
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto scrollbar-hide"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`transition-transform duration-300 relative ${pullStartRef.current !== null ? '!duration-0' : ''}`}
                    style={{ transform: `translateY(${pullPosition}px)` }}
                >
                    <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-center -translate-y-full pointer-events-none">
                        {isRefreshing ? (
                            <LoaderIcon className="w-6 h-6 text-primary animate-spin" />
                        ) : (
                            <ArrowDownIcon 
                                className="w-6 h-6 text-text-secondary transition-transform duration-200"
                                style={{ 
                                    opacity: Math.min(pullPosition / PULL_THRESHOLD, 1),
                                    transform: `rotate(${pullPosition >= PULL_THRESHOLD ? '180deg' : '0deg'})` 
                                }}
                            />
                        )}
                    </div>
                    <div className="p-4 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                    msg.sender === 'me'
                                        ? 'bg-primary text-white rounded-br-lg'
                                        : 'bg-white text-text-primary rounded-bl-lg'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <span className={`text-xs mt-1 block text-right opacity-70`}>{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                         <div ref={chatEndRef} />
                    </div>
                </div>
            </div>
            <div className="p-2 bg-white border-t border-border-soft flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full border border-transparent focus:ring-primary focus:border-primary focus:bg-white transition-colors"
                />
                <button
                    onClick={handleSend}
                    className="p-3 bg-primary text-white rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export const FavoritesScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedProperty } = useAppContext();
    const [favorites, setFavorites] = useState<Property[]>(MOCK_PROPERTIES.slice(1, 3)); // Mock favorites

    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
        setCurrentScreen(Screen.PROPERTY_DETAILS);
    };

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Favorites" />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                {favorites.length > 0 ? (
                    favorites.map(property => (
                        <PropertyCard key={property.id} property={property} onClick={() => handlePropertyClick(property)} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                        <HeartIcon className="w-16 h-16 mb-4 text-gray-300" />
                        <h2 className="font-heading text-xl font-semibold">No Favorites Yet</h2>
                        <p className="mt-2">Tap the heart on a property to save it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileScreen: React.FC = () => {
    const { setCurrentScreen, userRole, setUserRole, setIsAuthenticated } = useAppContext();
    
    const handleLogout = () => {
        setUserRole(UserRole.NONE);
        setIsAuthenticated(false);
        setCurrentScreen(Screen.TENANT_HOME);
    };

    const profileName = userRole === UserRole.TENANT ? "John Doe" : (userRole === UserRole.LANDLORD ? "Jane Smith" : "NyumbaNow Agency");
    const profileEmail = "example@email.com";

    const menuItems = [
        { label: 'Edit Profile', icon: UserIcon, screen: Screen.TENANT_PROFILE }, // Placeholder
        { label: 'Settings', icon: SettingsIcon, screen: Screen.SETTINGS },
        { label: 'Rules & Policies', icon: FileTextIcon, screen: Screen.RULES_AND_POLICIES },
        { label: 'About NyumbaNow', icon: InfoIcon, screen: Screen.ABOUT },
    ];

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Profile" />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                         <UserIcon className="w-12 h-12 text-gray-500" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold">{profileName}</h1>
                    <p className="text-text-secondary">{profileEmail}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    {menuItems.map((item, index) => (
                         <button key={item.label} onClick={() => setCurrentScreen(item.screen)} className={`w-full flex items-center p-4 text-left ${index < menuItems.length - 1 ? 'border-b border-border-soft' : ''}`}>
                            <item.icon className="w-6 h-6 mr-4 text-primary" />
                            <span className="flex-grow font-semibold text-text-primary">{item.label}</span>
                            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
                        </button>
                    ))}
                </div>
                
                 <div className="mt-6 bg-white rounded-lg shadow-sm">
                    <button onClick={handleLogout} className="w-full flex items-center p-4 text-left text-red-500">
                        <LogOutIcon className="w-6 h-6 mr-4" />
                        <span className="flex-grow font-semibold">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const TenantProfileScreen: React.FC = () => <ProfileScreen />;
export const AgentProfileScreen: React.FC = () => <ProfileScreen />;

const DashboardScreen: React.FC = () => {
    const { userRole, setCurrentScreen } = useAppContext();
    const stats = userRole === UserRole.LANDLORD ? 
        [{ label: 'Total Properties', value: 4 }, { label: 'Rented', value: 1 }, { label: 'Available', value: 3 }] :
        [{ label: 'Managed Properties', value: 12 }, { label: 'Rented', value: 5 }, { label: 'Available', value: 7 }];

    const title = userRole === UserRole.LANDLORD ? "Landlord Dashboard" : "Agent Dashboard";
    const addPropertyScreen = userRole === UserRole.LANDLORD ? Screen.ADD_PROPERTY : Screen.AGENT_PROPERTY_MANAGEMENT;
    
    const actionItems = [
        { id: 1, type: 'viewing', text: "New viewing request for '3 Bedroom in Area 49'", icon: CalendarIcon },
        { id: 2, type: 'message', text: "Unread message from 'Potential Tenant'", icon: MessageSquareIcon },
    ];


    return (
        <div className="flex flex-col h-full bg-secondary">
             <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 border-b border-border-soft">
                <h1 className="font-heading text-xl font-semibold text-text-primary">{title}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {stats.map(stat => (
                        <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm text-center">
                            <p className="text-2xl font-bold font-heading text-primary">{stat.value}</p>
                            <p className="text-xs text-text-secondary">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">Quick Actions</h2>
                    <Button onClick={() => setCurrentScreen(addPropertyScreen)} variant="outline">
                        + Add New Property
                    </Button>
                </div>

                <div>
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">Action Required</h2>
                    <div className="bg-white rounded-lg shadow-sm">
                        {actionItems.map((item, index) => (
                            <button key={item.id} onClick={() => {}} className={`w-full flex items-center p-3 text-left ${index < actionItems.length - 1 ? 'border-b border-border-soft' : ''}`}>
                                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                                    <item.icon className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <p className="text-sm text-text-primary truncate">{item.text}</p>
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-text-secondary flex-shrink-0 ml-2" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LandlordDashboardScreen: React.FC = () => <DashboardScreen />;
export const AgentDashboardScreen: React.FC = () => <DashboardScreen />;

const InputField = ({ label, id, ...props }: {label: string, id: string} & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-4 py-3 rounded-lg border border-border-soft focus:ring-primary focus:border-primary" />
    </div>
);

const TextAreaField = ({ label, id, ...props }: {label: string, id: string} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        <textarea id={id} {...props} className="w-full px-4 py-3 rounded-lg border border-border-soft focus:ring-primary focus:border-primary h-28 resize-none"></textarea>
    </div>
);

export const AddPropertyScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Add New Property" onBack={() => setCurrentScreen(Screen.LANDLORD_DASHBOARD)} />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                <InputField label="Property Title" id="title" type="text" placeholder="e.g., 3 Bedroom in Area 49" />
                <TextAreaField label="Description" id="description" placeholder="Describe the property..." />
                <InputField label="Price (MK/month)" id="price" type="number" placeholder="180000" />
                <InputField label="Location" id="location" type="text" placeholder="Area 49, Lilongwe" />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Bedrooms" id="bedrooms" type="number" placeholder="3" />
                    <InputField label="Bathrooms" id="bathrooms" type="number" placeholder="2" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Property Photos</label>
                    <div className="border-2 border-dashed border-border-soft rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                        <CameraIcon className="w-10 h-10 mx-auto text-gray-400 mb-2"/>
                        <p className="text-sm text-text-secondary">Tap to upload photos</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                </div>

                <Button onClick={() => alert('Property Submitted!')}>Submit Property</Button>
            </div>
        </div>
    );
};

const PropertyManagementCard: React.FC<{property: Property}> = ({ property }) => {
    const statusStyles: { [key in Property['status']]: string } = {
        Available: 'bg-green-100 text-green-800',
        Rented: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        'Under Maintenance': 'bg-blue-100 text-blue-800',
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="flex">
                <img src={property.imageUrl} alt={property.title} className="w-28 h-28 object-cover" />
                <div className="p-3 flex-grow">
                     <div className="flex justify-between items-start">
                        <h3 className="font-heading text-base font-semibold text-text-primary pr-2">{property.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 mt-0.5 rounded-full ${statusStyles[property.status]}`}>
                            {property.status}
                        </span>
                    </div>
                    <p className="font-heading text-primary font-bold text-sm my-1">MK {property.price.toLocaleString()}</p>
                    <div className="flex items-center text-text-secondary text-xs">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        <span>{property.location}</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-border-soft flex">
                <button className="flex-1 p-2 text-center text-sm font-semibold text-primary hover:bg-primary/10">View Listing</button>
                <button className="flex-1 p-2 border-l border-border-soft text-center text-sm font-semibold text-text-secondary hover:bg-gray-100">Edit</button>
            </div>
        </div>
    );
};

export const ManagePropertiesScreen: React.FC = () => {
    const { setCurrentScreen, userRole } = useAppContext();
    const addScreen = userRole === UserRole.LANDLORD ? Screen.ADD_PROPERTY : Screen.ADD_PROPERTY;

    const propertiesByLandlord = MOCK_PROPERTIES.reduce((acc, property) => {
        const group = acc[property.landlordId] || { name: property.landlordName, properties: [] };
        group.properties.push(property);
        acc[property.landlordId] = group;
        return acc;
    }, {} as Record<number, {name: string, properties: Property[]}>);

    return (
        <div className="flex flex-col h-full bg-secondary">
             <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 border-b border-border-soft">
                <h1 className="font-heading text-xl font-semibold text-text-primary">{userRole === UserRole.AGENT ? 'Managed Properties' : 'My Properties'}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                {userRole === UserRole.AGENT ? (
                    Object.values(propertiesByLandlord).map(landlordGroup => (
                        <div key={landlordGroup.name} className="mb-6">
                            <div className="flex items-center mb-3">
                                <BuildingIcon className="w-5 h-5 text-text-secondary mr-2" />
                                <h2 className="font-heading text-lg font-semibold text-text-primary">{landlordGroup.name}</h2>
                            </div>
                            {landlordGroup.properties.map(prop => <PropertyManagementCard key={prop.id} property={prop} />)}
                        </div>
                    ))
                ) : (
                    MOCK_PROPERTIES
                    .filter(p => p.landlordId === 1) // Mock: Assume logged in landlord is ID 1
                    .map(prop => <PropertyManagementCard key={prop.id} property={prop} />)
                )}
            </div>
            <div className="absolute bottom-20 right-4">
                <button onClick={() => setCurrentScreen(addScreen)} className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110">
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export const AgentPropertyManagementScreen: React.FC = () => <ManagePropertiesScreen />;

export const NotificationsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Notifications" onBack={() => setCurrentScreen(Screen.TENANT_HOME)} />
            <div className="flex-grow overflow-y-auto scrollbar-hide">
                {MOCK_NOTIFICATIONS.length > 0 ? (
                    <div className="divide-y divide-border-soft">
                        {MOCK_NOTIFICATIONS.map(notif => (
                            <div key={notif.id} className="p-4 flex items-start hover:bg-gray-50">
                                <div className="p-2 bg-primary/10 rounded-full mr-4">
                                    <BellIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-text-primary">{notif.title}</p>
                                        <p className="text-xs text-text-secondary">{notif.timestamp}</p>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">{notif.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                        <BellIcon className="w-16 h-16 mb-4 text-gray-300" />
                        <h2 className="font-heading text-xl font-semibold">No Notifications</h2>
                        <p className="mt-2">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const RulesAndPoliciesScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Rules & Policies" onBack={() => setCurrentScreen(Screen.TENANT_PROFILE)} />
            <div className="flex-grow overflow-y-auto p-6 prose prose-sm max-w-none scrollbar-hide">
                <h2 className="font-heading font-semibold">Community Guidelines</h2>
                <p>Welcome to NyumbaNow. To ensure a safe and respectful community, we require all users to adhere to the following guidelines...</p>
                <h3>1. Be Respectful</h3>
                <p>Treat all users—tenants, landlords, and agents—with courtesy and professionalism. Harassment, discrimination, or hate speech will not be tolerated.</p>
                <h3>2. Provide Accurate Information</h3>
                <p>Ensure all property listings, personal details, and communications are truthful and accurate. Misrepresentation can lead to account suspension.</p>
                <h3>3. No Scamming or Fraud</h3>
                <p>Any attempts at fraudulent activities, including fake listings or phishing attempts, will result in an immediate ban and may be reported to law enforcement.</p>
                 <h2 className="font-heading font-semibold mt-6">Terms of Service</h2>
                <p>By using NyumbaNow, you agree to our full terms of service. This includes agreements regarding payments, disputes, and data privacy...</p>
            </div>
        </div>
    );
};

export const SettingsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const settingsItems = [
        { label: 'Notifications', icon: BellIcon },
        { label: 'Privacy & Security', icon: UserIcon },
        { label: 'Help & Support', icon: InfoIcon },
    ];
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Settings" onBack={() => setCurrentScreen(Screen.TENANT_PROFILE)} />
            <div className="flex-grow overflow-y-auto scrollbar-hide p-4">
                 <div className="bg-white rounded-lg shadow-sm">
                    {settingsItems.map((item, index) => (
                         <button key={item.label} className={`w-full flex items-center p-4 text-left ${index < settingsItems.length - 1 ? 'border-b border-border-soft' : ''}`}>
                            <item.icon className="w-6 h-6 mr-4 text-primary" />
                            <span className="flex-grow font-semibold text-text-primary">{item.label}</span>
                            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AboutScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="About NyumbaNow" onBack={() => setCurrentScreen(Screen.TENANT_PROFILE)} />
            <div className="flex-grow p-6 text-center flex flex-col items-center justify-center">
                <NyumbaNowLogo className="w-20 h-20 text-primary mb-4" />
                <h1 className="text-3xl font-bold font-heading text-text-primary">NyumbaNow</h1>
                <p className="text-sm text-text-secondary mt-1">Version 1.0.0</p>
                <p className="mt-6 max-w-xs">
                    NyumbaNow is a modern, minimal house rental application for Malawi, connecting tenants, landlords, and agents to find and manage properties efficiently.
                </p>
                <p className="text-xs text-gray-400 mt-12">© 2024 NyumbaNow. All rights reserved.</p>
            </div>
        </div>
    );
};
