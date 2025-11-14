

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Review, ListingCategory } from '../types';
import { MOCK_LISTINGS, MOCK_LANDLORDS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MarketPaLineLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, MapIcon, ListIcon, PhoneIcon, SendIcon, ChevronRightIcon, SettingsIcon, FileTextIcon, InfoIcon, LogOutIcon, PlusCircleIcon, CameraIcon, BuildingIcon, CalendarIcon, LoaderIcon, ArrowDownIcon, ShareIcon, SortIcon, ChevronDownIcon, StarIcon, MailIcon, HouseIcon, CarIcon, BriefcaseIcon, TagIcon, CalendarDaysIcon, WifiIcon, ShieldIcon, ZapIcon, DropletIcon, GoogleIcon, FacebookIcon } from '../constants';
import { Button, ListingCard, Header, RecommendedListingCard, StarRating, ReviewCard } from './ui';

// --- Reusable Form Field Components ---

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


// --- Screen Components ---

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      // For a real app, you might check for an existing session here
      setCurrentScreen(Screen.HOME_SCREEN);
    }, 3000); 
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-hidden">
        <div className="w-24 h-24 mb-4">
             <MarketPaLineLogo className="w-full h-full splash-logo" stroke="#009639" />
        </div>
      <h1 id="splash-title" className="text-4xl font-bold font-heading text-text-primary splash-text">MarketPaLine</h1>
      <p id="splash-subtitle" className="text-lg text-text-secondary mt-2 splash-text">Buy, sell, and rent anything in Malawi.</p>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
    const { setCurrentScreen, setIsAuthenticated, userRole } = useAppContext();
    const handleLogin = () => {
        setIsAuthenticated(true);
        // If user already selected a role, go to their home screen, otherwise let them choose.
        if (userRole === UserRole.NONE) {
            setCurrentScreen(Screen.ROLE_SELECTION);
        } else if (userRole === UserRole.BUYER) {
            setCurrentScreen(Screen.HOME_SCREEN);
        } else {
            setCurrentScreen(Screen.DASHBOARD);
        }
    };
    return (
        <div className="p-8 flex flex-col justify-center h-full bg-secondary">
            <h1 className="font-heading text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-text-secondary mb-8">Enter your phone number to continue.</p>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="tel" 
                        id="phone" 
                        placeholder="+265 991 234 567" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-soft focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <Button onClick={handleLogin}>Continue</Button>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-border-soft"></div>
                <span className="flex-shrink mx-4 text-text-secondary text-sm">OR</span>
                <div className="flex-grow border-t border-border-soft"></div>
            </div>

            <div className="space-y-3">
                 <button onClick={handleLogin} className="w-full py-3 rounded-lg font-heading font-semibold transition-colors duration-300 text-center bg-white border border-border-soft text-text-primary hover:bg-gray-50 flex items-center justify-center">
                    <GoogleIcon className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Continue with Google</span>
                </button>
                <button onClick={handleLogin} className="w-full py-3 rounded-lg font-heading font-semibold transition-colors duration-300 text-center bg-[#1877F2] text-white border border-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center">
                    <FacebookIcon className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Continue with Facebook</span>
                </button>
            </div>

            <p className="text-center text-sm text-text-secondary mt-6">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleLogin(); }} className="font-semibold text-primary">Register</a>
            </p>
        </div>
    );
};

export const RoleSelectionScreen: React.FC = () => {
    const { setUserRole, setCurrentScreen, postLoginRedirect, setPostLoginRedirect } = useAppContext();
    const selectRole = (role: UserRole) => {
        setUserRole(role);

        let destination: Screen = Screen.HOME_SCREEN; // A safe default
        switch (role) {
            case UserRole.BUYER:
                destination = postLoginRedirect || Screen.HOME_SCREEN;
                break;
            case UserRole.SELLER:
                destination = Screen.DASHBOARD;
                break;
        }

        setCurrentScreen(destination);
        
        if (postLoginRedirect) {
            setPostLoginRedirect(null);
        }
    };

    return (
        <div className="p-8 flex flex-col justify-center h-full bg-secondary">
            <h1 className="font-heading text-2xl font-bold text-center mb-2">Choose Your Role</h1>
            <p className="text-text-secondary text-center mb-8">How will you be using MarketPaLine?</p>
            <div className="space-y-4">
                <Button onClick={() => selectRole(UserRole.BUYER)}>I want to Buy or Rent</Button>
                <Button onClick={() => selectRole(UserRole.SELLER)} variant="outline">I want to Sell or Hire Out</Button>
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
    const { setSelectedListing, setCurrentScreen } = useAppContext();
    const [activeListing, setActiveListing] = useState<Listing | null>(null);

    const handlePinClick = (listing: Listing) => {
        setActiveListing(listing);
    };
    
    const handleCardClick = (listing: Listing) => {
        setSelectedListing(listing);
        setCurrentScreen(Screen.LISTING_DETAILS);
    }

    return (
        <div className="flex-grow h-full relative">
            <div className="absolute inset-0 bg-gray-200">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/003/399/485/small/map-of-the-city-with-streets-and-districts-vector.jpg" className="w-full h-full object-cover opacity-50" alt="City Map"/>
            </div>
            
            {MOCK_LISTINGS.map((listing, index) => (
                <button 
                    key={listing.id} 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={MOCK_COORDINATES[index % MOCK_COORDINATES.length]}
                    onClick={() => handlePinClick(listing)}
                    aria-label={`View details for ${listing.title}`}
                >
                    <div className={`p-1 rounded-full shadow-lg transition-transform ${activeListing?.id === listing.id ? 'bg-primary scale-125' : 'bg-white'}`}>
                        <MapPinIcon className={`w-5 h-5 ${activeListing?.id === listing.id ? 'text-white' : 'text-primary'}`} />
                    </div>
                </button>
            ))}
            
            {activeListing && (
                <div className="absolute bottom-4 left-4 right-4 z-10 animate-fade-in-up">
                   <RecommendedListingCard listing={activeListing} onClick={() => handleCardClick(activeListing)} />
                </div>
            )}
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedListing, isAuthenticated } = useAppContext();
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [listings, setListings] = useState(MOCK_LISTINGS);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullPosition, setPullPosition] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pullStartRef = useRef<number | null>(null);

    type SortOption = 'recent' | 'price-asc' | 'price-desc';
    const [sortOption, setSortOption] = useState<SortOption>('recent');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'all'>('all');
    
    const [searchQuery, setSearchQuery] = useState('');

    const PULL_THRESHOLD = 80;
    const PULL_RESISTANCE = 0.5;
    
    const categories = [
        { name: 'Houses', icon: HouseIcon, category: ListingCategory.HOUSE_RENTAL },
        { name: 'For Sale', icon: TagIcon, category: ListingCategory.HOUSE_SALE }, // Simplified for UI
        { name: 'Cars', icon: CarIcon, category: ListingCategory.CAR_HIRE },
        { name: 'Venues', icon: CalendarDaysIcon, category: ListingCategory.EVENT_VENUE_HIRE },
        { name: 'Equipment', icon: BriefcaseIcon, category: ListingCategory.EQUIPMENT_HIRE },
    ];

    useEffect(() => {
        let processedListings = [...MOCK_LISTINGS];

        // Filter by category
        if (selectedCategory !== 'all') {
            if (selectedCategory === ListingCategory.HOUSE_SALE) {
                 processedListings = processedListings.filter(p => [ListingCategory.HOUSE_SALE, ListingCategory.LAND_SALE, ListingCategory.CAR_SALE, ListingCategory.ELECTRONICS_SALE].includes(p.category));
            } else if (selectedCategory === ListingCategory.CAR_HIRE) {
                 processedListings = processedListings.filter(p => [ListingCategory.CAR_HIRE, ListingCategory.CAR_SALE].includes(p.category));
            }
            else {
                processedListings = processedListings.filter(p => p.category === selectedCategory);
            }
        }

        // Filter by search query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            processedListings = processedListings.filter(p => 
                p.title.toLowerCase().includes(lowercasedQuery) ||
                p.location.toLowerCase().includes(lowercasedQuery) ||
                p.price.toString().includes(lowercasedQuery)
            );
        }

        // Sort the results
        switch (sortOption) {
            case 'price-asc':
                processedListings.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                processedListings.sort((a, b) => b.price - a.price);
                break;
            case 'recent':
            default:
                break;
        }
        setListings(processedListings);
    }, [sortOption, selectedCategory, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sortMenuRef]);


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
                const shuffled = [...listings].sort(() => Math.random() - 0.5);
                setListings(shuffled);
                setIsRefreshing(false);
                setPullPosition(0);
            }, 1500);
        } else {
            setPullPosition(0);
        }
    };

    const handleListingClick = (listing: Listing) => {
        setSelectedListing(listing);
        setCurrentScreen(Screen.LISTING_DETAILS);
    };
    
    const sortOptions: { label: string, value: SortOption }[] = [
        { label: 'Recently Added', value: 'recent' },
        { label: 'Price: Low to High', value: 'price-asc' },
        { label: 'Price: High to Low', value: 'price-desc' },
    ];

    const recommendedListings = listings.slice(0, 5);

    return (
        <div className="bg-secondary min-h-full flex flex-col">
            <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search for anything..." 
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-border-soft" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoComplete="off"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                     <button 
                        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} 
                        className="p-2 bg-white rounded-full shadow border border-border-soft hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label={viewMode === 'list' ? 'Switch to map view' : 'Switch to list view'}
                    >
                        {viewMode === 'list' ? <MapIcon className="w-5 h-5 text-text-primary" /> : <ListIcon className="w-5 h-5 text-text-primary" />}
                    </button>
                    {isAuthenticated ? (
                        <button
                            onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)}
                            className="p-2 bg-white rounded-full shadow border border-border-soft hover:bg-gray-100 transition-colors flex-shrink-0"
                            aria-label="View notifications"
                        >
                            <BellIcon className="w-5 h-5 text-text-primary" />
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
                <div className="mt-4">
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <button 
                            onClick={() => setSelectedCategory('all')} 
                            className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white border border-border-soft text-text-secondary'}`}
                        >
                           All
                        </button>
                        {categories.map(({name, icon: Icon, category}) => (
                             <button 
                                key={name}
                                onClick={() => setSelectedCategory(category)} 
                                className={`flex items-center flex-shrink-0 px-3 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === category ? 'bg-primary text-white' : 'bg-white border border-border-soft text-text-secondary'}`}
                            >
                               <Icon className="w-4 h-4 mr-1.5" />
                               {name}
                            </button>
                        ))}
                    </div>
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
                                {recommendedListings.map(item => (
                                    <RecommendedListingCard key={item.id} listing={item} onClick={() => handleListingClick(item)} />
                                ))}
                            </div>
                        </div>
                        <div className="px-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-heading text-xl font-semibold text-text-primary">All Listings</h2>
                                 <div className="relative" ref={sortMenuRef}>
                                    <button 
                                        onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} 
                                        className="px-3 py-1 bg-white border border-border-soft rounded-full text-sm text-text-secondary flex items-center flex-shrink-0"
                                    >
                                        <SortIcon className="w-4 h-4 mr-1.5" />
                                        <span>Sort</span>
                                        <ChevronDownIcon className={`w-4 h-4 ml-1 text-gray-400 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isSortMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1 border border-border-soft animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortOption(option.value);
                                                        setIsSortMenuOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm ${sortOption === option.value ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'} hover:bg-gray-100`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {listings.length > 0 ? (
                                listings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} onClick={() => handleListingClick(listing)} />
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-text-secondary">No listings found.</p>
                                    <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <MapView />
            )}
        </div>
    );
};


export const ListingDetailsScreen: React.FC = () => {
    const { selectedListing, setSelectedListing, setCurrentScreen, isAuthenticated, setPostLoginRedirect } = useAppContext();
    const [listingData, setListingData] = useState<Listing | null>(selectedListing);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // New state for modals
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showBookingConfirmationModal, setShowBookingConfirmationModal] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [showInquiryConfirmationModal, setShowInquiryConfirmationModal] = useState(false);


    useEffect(() => {
        if (!listingData) {
            setCurrentScreen(Screen.HOME_SCREEN);
        }
    }, [listingData, setCurrentScreen]);

    useEffect(() => {
        setIsImageLoading(true);
    }, [currentImageIndex]);

    if (!listingData) {
        return null; // Or a loading/error state
    }
    
    const handleActionClick = (action: () => void) => {
        if (isAuthenticated) {
            action();
        } else {
            setShowLoginModal(true);
        }
    };
    
    const handleShare = async () => {
        if (!listingData) return;

        const shareData = {
            title: `Check out this listing on MarketPaLine`,
            text: `${listingData.title}\nLocation: ${listingData.location}\nPrice: MK ${listingData.price.toLocaleString()}`,
            url: `https://marketpaline.app/listing/${listingData.id}` // Mock URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing listing:', err);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            alert('Sharing is not supported on your browser. You can manually copy the link: ' + shareData.url);
        }
    };
    
    const handleReviewSubmit = (rating: number, comment: string) => {
        const newReview: Review = {
            id: Date.now(),
            authorName: 'John Doe', // Mock user name
            rating,
            comment,
            timestamp: 'Just now',
        };

        const updatedReviews = [newReview, ...(listingData.reviews || [])];
        const updatedListing = { ...listingData, reviews: updatedReviews };
        
        setListingData(updatedListing);
        setSelectedListing(updatedListing); // Also update context if needed elsewhere
        setIsReviewModalOpen(false);
    };

    const handleScheduleSubmit = (date: string, time: string) => {
        console.log(`Viewing request for ${date} at ${time}`);
        setShowScheduleModal(false);
        setShowBookingConfirmationModal(true);
    };

    const handleInquirySubmit = (message: string) => {
        console.log("Inquiry sent:", message);
        setShowInquiryModal(false);
        setShowInquiryConfirmationModal(true);
    };


    const images = listingData.images.length > 0 ? listingData.images : [listingData.imageUrl];

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
                <h2 className="font-heading text-xl font-bold mb-2">Request Sent</h2>
                <p className="text-text-secondary mb-6">The seller has been notified. They will contact you shortly to confirm.</p>
                <Button onClick={onClose}>Got it</Button>
            </div>
        </div>
    );

    const InquiryConfirmationModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <h2 className="font-heading text-xl font-bold mb-2">Inquiry Sent</h2>
                <p className="text-text-secondary mb-6">Your message has been sent. The seller will respond to you soon.</p>
                <Button onClick={onClose}>Great!</Button>
            </div>
        </div>
    );
    
    const LoginRequiredModal = ({ onClose }: { onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <h2 className="font-heading text-xl font-bold mb-2">Login Required</h2>
                <p className="text-text-secondary mb-6">Please log in or register to contact the seller.</p>
                <Button onClick={() => {
                    onClose();
                    setPostLoginRedirect(Screen.LISTING_DETAILS);
                    setCurrentScreen(Screen.LOGIN);
                }} className="mb-2">Login / Register</Button>
                <button onClick={onClose} className="text-sm text-text-secondary">Maybe Later</button>
            </div>
        </div>
    );

    const ScheduleViewingModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (date: string, time: string) => void }) => {
        const [date, setDate] = useState('');
        const [time, setTime] = useState('');
    
        const handleSubmit = () => {
            if (date && time) {
                onSubmit(date, time);
            }
        };
    
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full animate-fade-in-up">
                    <h2 className="font-heading text-xl font-bold mb-4">Schedule a Viewing</h2>
                    <InputField label="Preferred Date" id="viewingDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/>
                    <InputField label="Preferred Time" id="viewingTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    <div className="flex gap-2 mt-4">
                        <Button onClick={onClose} variant="outline" className="w-1/2">Cancel</Button>
                        <Button onClick={handleSubmit} className="w-1/2" disabled={!date || !time}>Send Request</Button>
                    </div>
                </div>
            </div>
        );
    };
    
    const InquiryModal = ({ listing, onClose, onSubmit }: { listing: Listing, onClose: () => void, onSubmit: (message: string) => void }) => {
        const [message, setMessage] = useState(
          `Hi ${listing.sellerName}, I'm interested in "${listing.title}" at ${listing.location}. I'd like to know more details. Thank you!`
        );
    
        const handleSubmit = () => {
            if (message.trim()) {
                onSubmit(message);
            }
        };
    
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full animate-fade-in-up">
                    <h2 className="font-heading text-xl font-bold mb-4">Send an Inquiry</h2>
                    <TextAreaField
                        label={`Message to ${listing.sellerName}`}
                        id="inquiryMessage"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex gap-2 mt-4">
                        <Button onClick={onClose} variant="outline" className="w-1/2">Cancel</Button>
                        <Button onClick={handleSubmit} className="w-1/2" disabled={!message.trim()}>Send Inquiry</Button>
                    </div>
                </div>
            </div>
        );
    };

    const LeaveReviewModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (rating: number, comment: string) => void }) => {
        const [rating, setRating] = useState(0);
        const [comment, setComment] = useState('');
        const [hoverRating, setHoverRating] = useState(0);

        const handleSubmit = () => {
            if (rating > 0 && comment.trim().length > 0) {
                onSubmit(rating, comment);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full animate-fade-in-up">
                    <h2 className="font-heading text-xl font-bold mb-4">Leave a Review</h2>
                    <div className="mb-4">
                        <p className="block text-sm font-medium text-text-secondary mb-2">Your Rating</p>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button 
                                        key={starValue} 
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <StarIcon className={`w-8 h-8 transition-colors ${(hoverRating || rating) >= starValue ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <TextAreaField label="Your Comment" id="reviewComment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
                    <div className="flex gap-2 mt-4">
                        <Button onClick={onClose} variant="outline" className="w-1/2">Cancel</Button>
                        <Button onClick={handleSubmit} className="w-1/2" disabled={rating === 0 || !comment.trim()}>Submit</Button>
                    </div>
                </div>
            </div>
        );
    };


    const statusStyles: { [key: string]: string } = {
        Available: 'bg-green-100 text-green-800',
        Rented: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        'Under Maintenance': 'bg-blue-100 text-blue-800',
        Sold: 'bg-gray-100 text-gray-800',
    };
    
    const reviews = listingData.reviews || [];
    const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    const priceSuffix = listingData.priceType === 'per month' ? '/month' : listingData.priceType === 'per day' ? '/day' : '';
    const isViewable = [ListingCategory.HOUSE_RENTAL, ListingCategory.BEDROOM_RENTAL, ListingCategory.EVENT_VENUE_HIRE].includes(listingData.category);

    // FIX: Properly type the AmenityItem component as a React.FC to allow for the `key` prop.
    interface AmenityItemProps {
        icon: React.FC<React.SVGProps<SVGSVGElement>>;
        label: string;
    }
    const AmenityItem: React.FC<AmenityItemProps> = ({ icon: Icon, label }) => (
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-text-secondary">{label}</span>
        </div>
    );
    
    const amenities = [
        { name: 'Wi-Fi', icon: WifiIcon },
        { name: 'Parking', icon: CarIcon },
        { name: '24/7 Security', icon: ShieldIcon },
        { name: 'Electricity', icon: ZapIcon },
        { name: 'Running Water', icon: DropletIcon },
    ];
    const showAmenities = [ListingCategory.HOUSE_RENTAL, ListingCategory.HOUSE_SALE, ListingCategory.EVENT_VENUE_HIRE].includes(listingData.category);


    return (
        <div className="bg-secondary min-h-full">
            <div 
                className="relative w-full h-64 bg-gray-300"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <LoaderIcon className="w-12 h-12 text-primary animate-spin" />
                    </div>
                )}
                <img 
                    src={images[currentImageIndex]} 
                    alt={`${listingData.title} ${currentImageIndex + 1}`} 
                    className={`w-full h-full object-cover select-none transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsImageLoading(false)}
                    aria-live="polite"
                />
                
                <button onClick={() => setCurrentScreen(Screen.HOME_SCREEN)} className="absolute top-4 left-4 bg-black/40 p-2 rounded-full text-white z-10" aria-label="Back to home">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={handleShare} className="bg-black/40 p-2 rounded-full text-white" aria-label="Share listing">
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

            <div className="p-4 pb-40">
                <div className="flex justify-between items-start">
                    <div className="pr-2">
                        <h1 className="font-heading text-2xl font-bold text-text-primary">{listingData.title}</h1>
                         {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={averageRating} />
                                <span className="text-sm text-text-secondary">({reviews.length} review{reviews.length > 1 ? 's' : ''})</span>
                            </div>
                        )}
                    </div>
                    <div className={`text-xs flex-shrink-0 font-semibold px-2 py-1 rounded ${statusStyles[listingData.status]}`}>
                        {listingData.status}
                    </div>
                </div>

                <p className="font-heading text-primary font-bold text-2xl my-4">MK {listingData.price.toLocaleString()}{priceSuffix}</p>
                
                {(listingData.bedrooms || listingData.bathrooms) && (
                     <div className="bg-white rounded-lg shadow-sm p-4 flex items-center text-text-secondary text-base space-x-6">
                        {listingData.bedrooms && (
                            <div className="flex items-center">
                                <BedIcon className="w-5 h-5 mr-2 text-primary" />
                                <span>{listingData.bedrooms} Bedrooms</span>
                            </div>
                        )}
                        {listingData.bathrooms && (
                            <div className="flex items-center">
                                <BathIcon className="w-5 h-5 mr-2 text-primary" />
                                <span>{listingData.bathrooms} Bathrooms</span>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Description</h2>
                    <p className="text-text-secondary">{listingData.description}</p>
                </div>
                
                {showAmenities && (
                    <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Amenities</h2>
                        <div className="grid grid-cols-4 gap-y-4 text-center">
                            {amenities.slice(0, 4).map(amenity => <AmenityItem key={amenity.name} icon={amenity.icon} label={amenity.name} />)}
                        </div>
                    </div>
                )}

                <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4">
                        <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Location</h2>
                        <div className="flex items-center text-text-secondary text-base">
                            <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            <span>{listingData.location}</span>
                        </div>
                    </div>
                    <img src="https://picsum.photos/seed/map1/800/400" alt="Map of location" className="w-full h-40 object-cover" />
                </div>
                
                <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">About the Seller</h2>
                    <div className="flex items-center mb-4">
                        <img src={`https://picsum.photos/seed/seller${listingData.sellerId}/100`} alt={listingData.sellerName} className="w-12 h-12 rounded-full mr-4 bg-gray-200" />
                        <div>
                            <p className="font-semibold text-text-primary">{listingData.sellerName}</p>
                            <p className="text-sm text-text-secondary">Seller</p>
                        </div>
                    </div>
                     {isAuthenticated ? (
                         <div className="flex gap-3">
                            {listingData.phoneNumber && (
                                <a href={`tel:${listingData.phoneNumber}`} className="flex-1 bg-primary/10 text-primary font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                                    <PhoneIcon className="w-5 h-5 mr-2" /> Call
                                </a>
                            )}
                            {listingData.email && (
                                <a href={`mailto:${listingData.email}`} className="flex-1 bg-gray-200 text-text-primary font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                                    <MailIcon className="w-5 h-5 mr-2" /> Email
                                </a>
                            )}
                         </div>
                    ) : (
                        <div className="text-center p-4 border-t border-border-soft -m-4 mt-4">
                            <p className="text-text-secondary text-sm">Please log in to view contact details.</p>
                             <button
                                onClick={() => handleActionClick(() => {})}
                                className="mt-2 text-sm font-semibold text-primary hover:underline"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center p-4">
                        <h2 className="font-heading text-lg font-semibold text-text-primary">Reviews</h2>
                         {isAuthenticated && (
                            <button onClick={() => setIsReviewModalOpen(true)} className="text-sm font-semibold text-primary hover:underline">
                                Leave a Review
                            </button>
                        )}
                    </div>
                    <div className="px-4 divide-y divide-border-soft">
                        {reviews.length > 0 ? (
                            reviews.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-text-secondary">No reviews yet.</p>
                                <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white p-3 border-t border-border-soft flex items-center gap-3">
                 <Button onClick={() => handleActionClick(() => setShowInquiryModal(true))} variant="outline" className="w-full">
                    Inquire Now
                </Button>
                {isViewable && (
                    <Button onClick={() => handleActionClick(() => setShowScheduleModal(true))} className="w-full">
                        Schedule Viewing
                    </Button>
                )}
            </div>
             {showBookingConfirmationModal && <BookingConfirmationModal onClose={() => setShowBookingConfirmationModal(false)} />}
             {showInquiryConfirmationModal && <InquiryConfirmationModal onClose={() => setShowInquiryConfirmationModal(false)} />}
             {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
             {isReviewModalOpen && <LeaveReviewModal onClose={() => setIsReviewModalOpen(false)} onSubmit={handleReviewSubmit} />}
             {showScheduleModal && <ScheduleViewingModal onClose={() => setShowScheduleModal(false)} onSubmit={handleScheduleSubmit} />}
             {showInquiryModal && <InquiryModal listing={listingData} onClose={() => setShowInquiryModal(false)} onSubmit={handleInquirySubmit} />}
        </div>
    );
};

export const MessagesScreen: React.FC = () => {
    const { setCurrentScreen, selectedListing } = useAppContext();
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
    
    const contactName = selectedListing?.sellerName || "Messages";
    const backScreen = selectedListing ? Screen.LISTING_DETAILS : Screen.HOME_SCREEN;

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
    const { setCurrentScreen, setSelectedListing } = useAppContext();
    const [favorites, setFavorites] = useState<Listing[]>(MOCK_LISTINGS.slice(1, 3)); // Mock favorites

    const handleListingClick = (listing: Listing) => {
        setSelectedListing(listing);
        setCurrentScreen(Screen.LISTING_DETAILS);
    };

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Favorites" />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                {favorites.length > 0 ? (
                    favorites.map(listing => (
                        <ListingCard key={listing.id} listing={listing} onClick={() => handleListingClick(listing)} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                        <HeartIcon className="w-16 h-16 mb-4 text-gray-300" />
                        <h2 className="font-heading text-xl font-semibold">No Favorites Yet</h2>
                        <p className="mt-2">Tap the heart on a listing to save it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ProfileScreen: React.FC = () => {
    const { setCurrentScreen, userRole, setUserRole, setIsAuthenticated } = useAppContext();
    
    const handleLogout = () => {
        setUserRole(UserRole.NONE);
        setIsAuthenticated(false);
        setCurrentScreen(Screen.HOME_SCREEN);
    };

    const profileName = userRole === UserRole.BUYER ? "John Doe" : "Jane Smith";
    const profileEmail = "example@email.com";

    const menuItems = [
        { label: 'Edit Profile', icon: UserIcon, screen: Screen.EDIT_PROFILE },
        { label: 'Settings', icon: SettingsIcon, screen: Screen.SETTINGS },
        { label: 'Rules & Policies', icon: FileTextIcon, screen: Screen.RULES_AND_POLICIES },
        { label: 'About MarketPaLine', icon: InfoIcon, screen: Screen.ABOUT },
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

export const DashboardScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const stats = [{ label: 'Active Listings', value: 4 }, { label: 'Sold/Rented', value: 1 }, { label: 'Pending', value: 3 }];

    const title = "Seller Dashboard";
    
    const actionItems = [
        { id: 1, type: 'viewing', text: "New viewing request for '3 Bedroom in Area 49'", icon: CalendarIcon },
        { id: 2, type: 'message', text: "Unread message from 'Potential Buyer'", icon: MessageSquareIcon },
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
                    <Button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} variant="outline">
                        + Post a New Ad
                    </Button>
                </div>

                <div>
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-3">Action Required</h2>
                    <div className="bg-white rounded-lg shadow-sm">
                        {actionItems.map((item, index) => (
                            <button key={item.id} onClick={() => setCurrentScreen(Screen.MESSAGES)} className={`w-full flex items-center p-3 text-left ${index < actionItems.length - 1 ? 'border-b border-border-soft' : ''}`}>
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

export const AddListingScreen: React.FC = () => {
    const { setCurrentScreen, listingToEdit, setListingToEdit } = useAppContext();
    const isEditMode = !!listingToEdit;

    const [category, setCategory] = useState<ListingCategory>(ListingCategory.HOUSE_RENTAL);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');

    useEffect(() => {
        if (listingToEdit) {
            setTitle(listingToEdit.title);
            setDescription(listingToEdit.description);
            setPrice(listingToEdit.price.toString());
            setLocation(listingToEdit.location);
            setBedrooms(listingToEdit.bedrooms?.toString() || '');
            setBathrooms(listingToEdit.bathrooms?.toString() || '');
            setCategory(listingToEdit.category);
        } else {
            // Reset form
            setTitle(''); setDescription(''); setPrice(''); setLocation(''); setBedrooms(''); setBathrooms('');
            setCategory(ListingCategory.HOUSE_RENTAL);
        }
    }, [listingToEdit]);

    const handleBack = () => {
        setListingToEdit(null);
        setCurrentScreen(isEditMode ? Screen.MANAGE_LISTINGS : Screen.DASHBOARD);
    };

    const handleSubmit = () => {
        alert(isEditMode ? 'Listing Updated!' : 'Listing Submitted!');
        setListingToEdit(null);
        setCurrentScreen(Screen.MANAGE_LISTINGS);
    };
    
    const showPropertyFields = [ListingCategory.HOUSE_RENTAL, ListingCategory.HOUSE_SALE, ListingCategory.BEDROOM_RENTAL].includes(category);
    
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title={isEditMode ? "Edit Listing" : "Create New Listing"} onBack={handleBack} />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                    <div className="relative">
                        <select
                            id="category"
                            value={category}
                            onChange={e => setCategory(e.target.value as ListingCategory)}
                            className="w-full px-4 py-3 rounded-lg border border-border-soft focus:ring-primary focus:border-primary bg-white appearance-none"
                            disabled={isEditMode}
                        >
                            {Object.values(ListingCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <InputField label="Title" id="title" type="text" placeholder="e.g., Slightly Used Dell Laptop" value={title} onChange={e => setTitle(e.target.value)} />
                <TextAreaField label="Description" id="description" placeholder="Describe the item..." value={description} onChange={e => setDescription(e.target.value)} />
                <InputField label="Price (MK)" id="price" type="number" placeholder="350000" value={price} onChange={e => setPrice(e.target.value)} />
                <InputField label="Location" id="location" type="text" placeholder="Blantyre, Malawi" value={location} onChange={e => setLocation(e.target.value)} />
                
                {showPropertyFields && (
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Bedrooms" id="bedrooms" type="number" placeholder="3" value={bedrooms} onChange={e => setBedrooms(e.target.value)} />
                        <InputField label="Bathrooms" id="bathrooms" type="number" placeholder="2" value={bathrooms} onChange={e => setBathrooms(e.target.value)} />
                    </div>
                )}
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Photos</label>
                    <div className="border-2 border-dashed border-border-soft rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                        <CameraIcon className="w-10 h-10 mx-auto text-gray-400 mb-2"/>
                        <p className="text-sm text-text-secondary">Tap to upload photos</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                </div>

                <Button onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Submit Listing'}</Button>
            </div>
        </div>
    );
};

interface ListingManagementCardProps {
    listing: Listing;
    onViewListing: (listing: Listing) => void;
    onEdit: () => void;
}

const ListingManagementCard: React.FC<ListingManagementCardProps> = ({ listing, onViewListing, onEdit }) => {
    const statusStyles: { [key in Listing['status']]: string } = {
        Available: 'bg-green-100 text-green-800',
        Rented: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        'Under Maintenance': 'bg-blue-100 text-blue-800',
        Sold: 'bg-gray-100 text-gray-800',
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div className="flex">
                <img src={listing.imageUrl} alt={listing.title} className="w-28 h-28 object-cover" />
                <div className="p-3 flex-grow">
                     <div className="flex justify-between items-start">
                        <h3 className="font-heading text-base font-semibold text-text-primary pr-2">{listing.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 mt-0.5 rounded-full ${statusStyles[listing.status]}`}>
                            {listing.status}
                        </span>
                    </div>
                    <p className="font-heading text-primary font-bold text-sm my-1">MK {listing.price.toLocaleString()}</p>
                    <div className="flex items-center text-text-secondary text-xs">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        <span>{listing.location}</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-border-soft flex">
                <button onClick={() => onViewListing(listing)} className="flex-1 p-2 text-center text-sm font-semibold text-primary hover:bg-primary/10">View Listing</button>
                <button onClick={onEdit} className="flex-1 p-2 border-l border-border-soft text-center text-sm font-semibold text-text-secondary hover:bg-gray-100">Edit</button>
            </div>
        </div>
    );
};

export const ManageListingsScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedListing, setListingToEdit } = useAppContext();

    const handleViewListing = (listing: Listing) => {
        setSelectedListing(listing);
        setCurrentScreen(Screen.LISTING_DETAILS);
    };

    const handleEdit = (listing: Listing) => {
        setListingToEdit(listing);
        setCurrentScreen(Screen.ADD_LISTING);
    };

    // Mock: Assume logged in seller is ID 1
    const mylistings = MOCK_LISTINGS.filter(p => p.sellerId === 1); 

    return (
        <div className="flex flex-col h-full bg-secondary">
             <div className="p-4 sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 border-b border-border-soft">
                <h1 className="font-heading text-xl font-semibold text-text-primary">My Listings</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                {mylistings.map(listing => <ListingManagementCard key={listing.id} listing={listing} onViewListing={handleViewListing} onEdit={() => handleEdit(listing)} />)}
            </div>
            <div className="absolute bottom-20 right-4">
                <button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110">
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export const NotificationsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Notifications" onBack={() => setCurrentScreen(Screen.HOME_SCREEN)} />
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
            <Header title="Rules & Policies" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="flex-grow overflow-y-auto p-6 prose prose-sm max-w-none scrollbar-hide">
                <h2 className="font-heading font-semibold">Community Guidelines</h2>
                <p>Welcome to MarketPaLine. To ensure a safe and respectful community, we require all users to adhere to the following guidelines...</p>
                <h3>1. Be Respectful</h3>
                <p>Treat all users with courtesy and professionalism. Harassment, discrimination, or hate speech will not be tolerated.</p>
                <h3>2. Provide Accurate Information</h3>
                <p>Ensure all listings, personal details, and communications are truthful and accurate. Misrepresentation can lead to account suspension.</p>
                <h3>3. No Scamming or Fraud</h3>
                <p>Any attempts at fraudulent activities, including fake listings or phishing attempts, will result in an immediate ban and may be reported to law enforcement.</p>
                 <h2 className="font-heading font-semibold mt-6">Terms of Service</h2>
                <p>By using MarketPaLine, you agree to our full terms of service. This includes agreements regarding payments, disputes, and data privacy...</p>
            </div>
        </div>
    );
};

export const SettingsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const settingsItems = [
        { label: 'Notifications', icon: BellIcon, action: () => setCurrentScreen(Screen.NOTIFICATIONS) },
        { label: 'Privacy & Security', icon: UserIcon, action: () => alert('Privacy & Security settings coming soon!') },
        { label: 'Help & Support', icon: InfoIcon, action: () => alert('Help & Support section coming soon!') },
    ];
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Settings" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="flex-grow overflow-y-auto scrollbar-hide p-4">
                 <div className="bg-white rounded-lg shadow-sm">
                    {settingsItems.map((item, index) => (
                         <button key={item.label} onClick={item.action} className={`w-full flex items-center p-4 text-left ${index < settingsItems.length - 1 ? 'border-b border-border-soft' : ''}`}>
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
            <Header title="About MarketPaLine" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="flex-grow p-6 text-center flex flex-col items-center justify-center">
                <MarketPaLineLogo className="w-20 h-20 text-primary mb-4" />
                <h1 className="text-3xl font-bold font-heading text-text-primary">MarketPaLine</h1>
                <p className="text-sm text-text-secondary mt-1">Version 2.0.0</p>
                <p className="mt-6 max-w-xs">
                    MarketPaLine is a modern marketplace for Malawi, connecting people to buy, sell, and rent goods and services.
                </p>
                <p className="text-xs text-gray-400 mt-12">© 2024 MarketPaLine. All rights reserved.</p>
            </div>
        </div>
    );
};

export const EditProfileScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Edit Profile" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="flex-grow overflow-y-auto p-4 scrollbar-hide">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center relative group">
                         <UserIcon className="w-12 h-12 text-gray-500" />
                         <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <CameraIcon className="w-8 h-8 text-white" />
                         </div>
                    </div>
                </div>
                <InputField label="Full Name" id="fullName" type="text" defaultValue="John Doe" />
                <InputField label="Email Address" id="email" type="email" defaultValue="example@email.com" />
                <InputField label="Phone Number" id="phone" type="tel" defaultValue="+256 123 456 789" />

                <div className="mt-6">
                    <Button onClick={() => setCurrentScreen(Screen.PROFILE)}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};