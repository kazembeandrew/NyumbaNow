
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Review, ListingCategory, Message, Conversation, Booking } from '../types';
import { NyumbaNowLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, MapIcon, ListIcon, PhoneIcon, SendIcon, ChevronRightIcon, SettingsIcon, LogOutIcon, PlusCircleIcon, CameraIcon, LoaderIcon, ArrowDownIcon, SortIcon, ChevronDownIcon, StarIcon, MailIcon, HouseIcon, CarIcon, BriefcaseIcon, ShieldCheckIcon, DropletsIcon, SunIcon, FilterIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '../constants';
import { Button, ListingCard, Header, StarRating, ReviewCard, ListingSkeleton } from './ui';
import { supabase } from '../supabaseClient';
import { useListings } from '../hooks/useListings';

// --- Helper Functions ---

const dataURLtoBlob = (dataurl: string) => {
    try {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    } catch (e) { return null; }
};

const uploadImageToSupabase = async (base64Image: string): Promise<string | null> => {
    try {
        const blob = dataURLtoBlob(base64Image);
        if (!blob) throw new Error("Invalid image data");
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const { error } = await supabase.storage.from('listings').upload(fileName, blob, { contentType: 'image/jpeg' });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(fileName);
        return publicUrl;
    } catch (error) { return null; }
};

// --- Screen Components ---

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, setIsAuthenticated } = useAppContext();
  useEffect(() => {
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) setIsAuthenticated(true);
          setCurrentScreen(Screen.HOME_SCREEN);
      });
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-hidden">
        <div className="w-24 h-24 mb-4 text-primary">
             <NyumbaNowLogo className="w-full h-full splash-logo" />
        </div>
      <h1 className="text-4xl font-bold font-heading text-primary splash-text">NyumbaNow</h1>
      <p className="text-lg text-text-secondary mt-2 splash-text">Malawi's House Rental Market</p>
    </div>
  );
};

export const LoginScreen: React.FC = () => {
    const { setCurrentScreen, setIsAuthenticated } = useAppContext();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const handleLogin = async () => {
        if (!email) { setMessage("Email is required."); return; }
        setIsLoading(true); setMessage('');
        try {
            const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
            if (error) setMessage(error.message);
            else setMessage('Link sent! Check your inbox.');
        } catch (error) { setMessage('Login failed.'); }
        finally { setIsLoading(false); }
    };
    return (
        <div className="p-8 flex flex-col justify-center h-full bg-secondary">
            <h1 className="font-heading text-3xl font-bold mb-2">Welcome</h1>
            <p className="text-text-secondary mb-8">Login to save favorites and chat with owners.</p>
            <div className="mb-4">
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.mw" className="w-full px-4 py-3 rounded-xl border border-border-soft focus:ring-primary focus:border-primary outline-none" />
            </div>
            {message && <div className="mb-4 text-sm text-primary font-medium">{message}</div>}
            <Button onClick={handleLogin} disabled={isLoading}>{isLoading ? 'Loading...' : 'Send Magic Link'}</Button>
            <button onClick={() => { setIsAuthenticated(true); setCurrentScreen(Screen.HOME_SCREEN); }} className="mt-8 text-xs text-gray-400 underline w-full text-center">(Demo Mode)</button>
        </div>
    );
};

export const RoleSelectionScreen: React.FC = () => {
    const { setUserRole, setCurrentScreen } = useAppContext();

    const selectRole = (role: UserRole) => {
        setUserRole(role);
        if (role === UserRole.BUYER) {
            setCurrentScreen(Screen.HOME_SCREEN);
        } else {
            setCurrentScreen(Screen.DASHBOARD);
        }
    };

    return (
        <div className="flex flex-col h-full bg-secondary p-8 justify-center">
            <div className="text-center mb-12">
                <NyumbaNowLogo className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold font-heading text-text-primary">Continue as...</h1>
                <p className="text-text-secondary mt-2">Choose how you want to use NyumbaNow</p>
            </div>
            
            <div className="space-y-4">
                <button 
                    onClick={() => selectRole(UserRole.BUYER)}
                    className="w-full bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center border-2 border-transparent hover:border-primary transition-all text-center"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                        <HouseIcon />
                    </div>
                    <h3 className="font-bold text-xl">I want to Rent</h3>
                    <p className="text-sm text-text-secondary">Find your next home in Malawi</p>
                </button>

                <button 
                    onClick={() => selectRole(UserRole.SELLER)}
                    className="w-full bg-white p-6 rounded-3xl shadow-sm flex flex-col items-center border-2 border-transparent hover:border-primary transition-all text-center"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                        <BriefcaseIcon />
                    </div>
                    <h3 className="font-bold text-xl">I want to List</h3>
                    <p className="text-sm text-text-secondary">Advertise your property or agency</p>
                </button>
            </div>
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedListing, isAuthenticated } = useAppContext();
    const { listings, loading: isLoading } = useListings();
    const [search, setSearch] = useState('');
    const [isMapMode, setIsMapMode] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const filtered = listings.filter(l => 
        l.title.toLowerCase().includes(search.toLowerCase()) || 
        l.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-secondary min-h-full flex flex-col pb-20">
            <div className="p-4 pt-6 bg-white border-b border-border-soft sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <NyumbaNowLogo className="text-primary w-8 h-8" />
                    <h1 className="font-heading text-xl font-bold tracking-tight">NyumbaNow</h1>
                    <div className="flex-grow"></div>
                    <button onClick={() => setIsMapMode(!isMapMode)} className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-xs font-bold text-text-primary border border-border-soft">
                        {isMapMode ? <ListIcon className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                        {isMapMode ? 'LIST' : 'MAP'}
                    </button>
                    {isAuthenticated && (
                        <button onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)} className="p-2 bg-secondary rounded-full relative">
                            <BellIcon className="w-5 h-5" />
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search Areas (e.g. Area 10, Nyambadwe)" className="w-full px-4 py-3 rounded-xl bg-secondary border-none outline-none text-sm placeholder:text-gray-400 font-medium" />
                    </div>
                    <button onClick={() => setShowFilters(true)} className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                        <FilterIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="p-4 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading font-bold text-lg">Featured Rentals</h2>
                    <span className="text-xs font-bold text-text-secondary">{filtered.length} Properties</span>
                </div>
                
                {isLoading && filtered.length === 0 ? (
                    <div className="space-y-4">
                        <ListingSkeleton />
                        <ListingSkeleton />
                        <ListingSkeleton />
                    </div>
                ) : isMapMode ? (
                    <div className="bg-white rounded-3xl h-96 flex flex-col items-center justify-center border border-dashed border-gray-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-50 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Blank_Map_of_Malawi.svg/800px-Blank_Map_of_Malawi.svg.png')] bg-center bg-no-repeat bg-contain"></div>
                        <MapIcon className="w-12 h-12 text-gray-200 mb-4" />
                        <h3 className="font-bold relative z-10">Map Discovery Mode</h3>
                        <p className="text-xs text-text-secondary text-center px-10 relative z-10">Zoom into Lilongwe, Blantyre or Mzuzu to see active property pins.</p>
                        <button className="mt-6 bg-primary text-white px-6 py-2 rounded-full font-bold text-xs relative z-10 shadow-lg" onClick={() => setIsMapMode(false)}>BACK TO LIST</button>
                    </div>
                ) : filtered.length > 0 ? (
                    filtered.map(l => <ListingCard key={l.id} listing={l} onClick={() => { setSelectedListing(l); setCurrentScreen(Screen.LISTING_DETAILS); }} />)
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-border-soft px-8">
                        <HouseIcon className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="font-bold text-lg">No Results Found</h3>
                        <p className="text-sm text-text-secondary mt-2">Try adjusting your area search or checking different property types.</p>
                    </div>
                )}
            </div>

            {/* Filter Modal Overlay */}
            {showFilters && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center p-4 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-8 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold font-heading">Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="text-text-secondary font-bold text-sm">Clear All</button>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Price Range (MK)</label>
                            <div className="flex gap-4">
                                <input type="number" placeholder="Min" className="flex-1 bg-secondary p-3 rounded-xl outline-none font-bold text-sm" />
                                <input type="number" placeholder="Max" className="flex-1 bg-secondary p-3 rounded-xl outline-none font-bold text-sm" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Essentials</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 border-2 border-primary bg-primary/5 text-primary rounded-2xl font-bold text-xs flex items-center gap-2">
                                    <SunIcon className="w-4 h-4" /> Backup Power
                                </button>
                                <button className="p-3 border-2 border-border-soft text-text-secondary rounded-2xl font-bold text-xs flex items-center gap-2">
                                    <DropletsIcon className="w-4 h-4" /> Borehole
                                </button>
                                <button className="p-3 border-2 border-border-soft text-text-secondary rounded-2xl font-bold text-xs flex items-center gap-2">
                                    <ShieldCheckIcon className="w-4 h-4" /> Electric Fence
                                </button>
                                <button className="p-3 border-2 border-border-soft text-text-secondary rounded-2xl font-bold text-xs flex items-center gap-2">
                                    <ShieldCheckIcon className="w-4 h-4" /> Verified Agent
                                </button>
                            </div>
                        </div>
                        <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ListingDetailsScreen: React.FC = () => {
    const { selectedListing, setCurrentScreen, isAuthenticated, setActiveChatPartner, setSelectedListing } = useAppContext();
    const [isFav, setIsFav] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [fullLoading, setFullLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && selectedListing) checkFav();
        if (selectedListing && (!selectedListing.description || !selectedListing.amenities)) {
            fetchFullListing();
        }
    }, [selectedListing, isAuthenticated]);

    const fetchFullListing = async () => {
        if (!selectedListing) return;
        setFullLoading(true);
        try {
            const { data } = await supabase.from('listings').select('*').eq('id', selectedListing.id).single();
            if (data) {
                setSelectedListing({
                    ...selectedListing,
                    description: data.description,
                    amenities: data.amenities || []
                });
            }
        } catch (e) {} finally { setFullLoading(false); }
    };

    const checkFav = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('favorites').select('*').eq('user_id', user.id).eq('listing_id', selectedListing?.id).single();
        if (data) setIsFav(true);
    };

    const toggleFav = async () => {
        if (!isAuthenticated) { setCurrentScreen(Screen.LOGIN); return; }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Optimistic UI
        const wasFav = isFav;
        setIsFav(!isFav);

        try {
            if (wasFav) {
                await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', selectedListing?.id);
            } else {
                await supabase.from('favorites').insert({ user_id: user.id, listing_id: selectedListing?.id });
            }
        } catch (e) {
            setIsFav(wasFav); // Revert on error
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) { setCurrentScreen(Screen.LOGIN); return; }
        if (!bookingDate) { alert('Please select a date.'); return; }
        setBookingLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !selectedListing) return;
            
            const { error } = await supabase.from('viewings').insert({
                listing_id: selectedListing.id,
                tenant_id: user.id,
                landlord_id: selectedListing.sellerId,
                viewing_date: bookingDate,
                time_slot: timeSlot,
                status: 'Pending'
            });
            
            if (error) throw error;
            alert('Viewing request sent! The agent will confirm shortly.');
            setShowBookingModal(false);
            setCurrentScreen(Screen.BOOKINGS);
        } catch (e: any) {
            alert('Failed to request viewing: ' + e.message);
        } finally {
            setBookingLoading(false);
        }
    };

    const startChat = () => {
        if (!isAuthenticated) { setCurrentScreen(Screen.LOGIN); return; }
        if (selectedListing) {
            setActiveChatPartner({ id: selectedListing.sellerId, name: selectedListing.sellerName });
            setCurrentScreen(Screen.CHAT_ROOM);
        }
    };

    if (!selectedListing) return null;

    return (
        <div className="flex flex-col h-full bg-white pb-24">
            <div className="relative h-96">
                <img src={selectedListing.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent"></div>
                <button onClick={() => setCurrentScreen(Screen.HOME_SCREEN)} className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full transition-transform active:scale-90">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button onClick={toggleFav} className="absolute top-6 right-6 p-3 bg-white text-primary rounded-full shadow-xl shadow-primary/20 transition-transform active:scale-90">
                    <HeartIcon className={isFav ? 'fill-primary text-primary' : ''} />
                </button>
            </div>
            <div className="px-6 -mt-8 bg-white rounded-t-[40px] relative z-10 pt-10">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold font-heading text-text-primary leading-tight">{selectedListing.title}</h1>
                    <div className="text-right">
                        <span className="text-primary font-bold text-2xl">MK {selectedListing.price.toLocaleString()}</span>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Fixed Monthly</p>
                    </div>
                </div>
                <div className="flex items-center text-text-secondary text-sm mb-8 font-medium">
                    <MapPinIcon className="w-4 h-4 mr-1.5 text-primary" /> {selectedListing.location}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-4 bg-secondary rounded-[24px] flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><BedIcon className="w-6 h-6" /></div>
                        <div><p className="font-bold text-lg">{selectedListing.bedrooms}</p><p className="text-[10px] font-bold text-text-secondary uppercase">Bedrooms</p></div>
                    </div>
                    <div className="p-4 bg-secondary rounded-[24px] flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><BathIcon className="w-6 h-6" /></div>
                        <div><p className="font-bold text-lg">{selectedListing.bathrooms}</p><p className="text-[10px] font-bold text-text-secondary uppercase">Bathrooms</p></div>
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-4 font-heading">House Features</h3>
                <div className="flex flex-wrap gap-2 mb-10">
                    {fullLoading ? (
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse"></div>
                            <div className="h-8 w-24 bg-gray-100 rounded-full animate-pulse"></div>
                        </div>
                    ) : (
                        selectedListing.amenities?.map((amenity, i) => (
                            <div key={i} className="px-4 py-2 bg-blue-50 text-primary rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
                                {amenity.includes('Solar') ? <SunIcon className="w-3.5 h-3.5" /> : amenity.includes('Borehole') ? <DropletsIcon className="w-3.5 h-3.5" /> : <ShieldCheckIcon className="w-3.5 h-3.5" />}
                                {amenity}
                            </div>
                        ))
                    )}
                </div>

                <h3 className="font-bold text-lg mb-3 font-heading">Description</h3>
                {fullLoading ? (
                    <div className="space-y-2 mb-10">
                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                    </div>
                ) : (
                    <p className="text-text-secondary text-sm leading-relaxed mb-10">{selectedListing.description || 'Loading property details...'}</p>
                )}
                
                <div className="p-5 border-2 border-border-soft rounded-[32px] flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-primary text-xl border border-primary/20">{selectedListing.sellerName[0]}</div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            <p className="font-bold">{selectedListing.sellerName}</p>
                            {selectedListing.isVerified && <ShieldCheckIcon className="w-4 h-4 text-primary fill-primary/10" />}
                        </div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Property Agent</p>
                    </div>
                    <button onClick={startChat} className="p-3 bg-secondary text-primary rounded-2xl hover:bg-primary/10 transition-colors">
                        <MessageSquareIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-border-soft flex gap-4 z-20 max-w-sm mx-auto backdrop-blur-md bg-white/90">
                <a href={`tel:${selectedListing.phoneNumber || '0999000000'}`} className="flex-1 bg-secondary text-primary py-4 rounded-[20px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-border-soft">
                    <PhoneIcon className="w-5 h-5" /> CALL
                </a>
                <button onClick={() => setShowBookingModal(true)} className="flex-1 bg-primary text-white py-4 rounded-[20px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/30">
                    <CalendarIcon className="w-5 h-5" /> BOOK TOUR
                </button>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center p-4 backdrop-blur-sm" onClick={() => setShowBookingModal(false)}>
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-8 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold font-heading">Schedule Viewing</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-text-secondary font-bold text-sm">Close</button>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Pick a Date</label>
                            <input 
                                type="date" 
                                value={bookingDate}
                                onChange={e => setBookingDate(e.target.value)}
                                className="w-full bg-secondary p-4 rounded-2xl outline-none font-bold text-sm border border-transparent focus:border-primary"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Preferred Time</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['Morning', 'Afternoon', 'Evening'] as const).map(slot => (
                                    <button 
                                        key={slot}
                                        onClick={() => setTimeSlot(slot)}
                                        className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${timeSlot === slot ? 'bg-primary/5 text-primary border-primary' : 'bg-white text-gray-400 border-border-soft'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9px] text-text-secondary font-medium leading-relaxed italic">The agent will verify availability and confirm your request.</p>
                        </div>

                        <Button onClick={handleBooking} disabled={bookingLoading}>
                            {bookingLoading ? <LoaderIcon className="animate-spin mx-auto w-5 h-5" /> : 'CONFIRM REQUEST'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const BookingsScreen: React.FC = () => {
    const { setCurrentScreen, userRole } = useAppContext();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        let query = supabase.from('viewings').select('*, listings(title, image_url)');
        
        if (userRole === UserRole.SELLER) {
            query = query.eq('landlord_id', user.id);
        } else {
            query = query.eq('tenant_id', user.id);
        }

        const { data } = await query.order('viewing_date', { ascending: true });
        if (data) setBookings(data.map((b: any) => ({
            ...b,
            listing_title: b.listings.title,
            listing_image: b.listings.image_url
        })));
        setLoading(false);
    };

    const updateBookingStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('viewings').update({ status }).eq('id', id);
        if (error) alert('Failed to update: ' + error.message);
        else fetchBookings();
    };

    useEffect(() => { fetchBookings(); }, [userRole]);

    return (
        <div className="flex flex-col h-full bg-secondary pb-20">
            <Header title={userRole === UserRole.SELLER ? 'Property Tours' : 'My Viewing Tours'} />
            <div className="p-4 flex-grow overflow-y-auto scrollbar-hide space-y-4">
                {loading ? (
                    <div className="flex justify-center p-20"><LoaderIcon className="animate-spin text-primary" /></div>
                ) : bookings.length > 0 ? (
                    bookings.map(b => (
                        <div key={b.id} className="bg-white rounded-3xl p-4 shadow-sm border border-border-soft flex gap-4">
                            <img src={b.listing_image} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-sm truncate mb-1">{b.listing_title}</h4>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex items-center text-[10px] text-text-secondary font-bold uppercase gap-1">
                                        <CalendarIcon className="w-3 h-3" /> {b.viewing_date}
                                    </div>
                                    <div className="flex items-center text-[10px] text-text-secondary font-bold uppercase gap-1">
                                        <ClockIcon className="w-3 h-3" /> {b.time_slot}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                                        b.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                                        b.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                        {b.status}
                                    </span>
                                    {userRole === UserRole.SELLER && b.status === 'Pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="p-2 bg-primary text-white rounded-lg shadow-sm">
                                                <CheckCircleIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                        <CalendarIcon className="w-16 h-16 text-gray-100 mb-6" />
                        <h3 className="font-bold text-xl font-heading mb-2">No Scheduled Viewings</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">Book a viewing to see a property in person. Be safe and always meet in the daytime!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const FavoritesScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedListing, isAuthenticated } = useAppContext();
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated) { setLoading(false); return; }
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const { data } = await supabase
                .from('favorites')
                .select('listings(*)')
                .eq('user_id', user.id);
            
            if (data) {
                setFavorites(data.map((f: any) => ({
                    ...f.listings,
                    priceType: f.listings.price_type,
                    imageUrl: f.listings.image_url,
                    sellerId: f.listings.seller_id,
                    sellerName: f.listings.seller_name,
                    isVerified: f.listings.is_verified || false
                })));
            }
            setLoading(false);
        };
        fetchFavorites();
    }, [isAuthenticated]);

    return (
        <div className="flex flex-col h-full bg-secondary pb-20">
            <Header title="Saved Properties" />
            <div className="p-4 flex-grow overflow-y-auto scrollbar-hide">
                {loading ? (
                    <div className="space-y-4">
                        <ListingSkeleton />
                        <ListingSkeleton />
                    </div>
                ) : favorites.length > 0 ? (
                    favorites.map(l => <ListingCard key={l.id} listing={l} onClick={() => { setSelectedListing(l); setCurrentScreen(Screen.LISTING_DETAILS); }} />)
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                        <HeartIcon className="w-16 h-16 text-gray-100 mb-6" />
                        <h3 className="font-bold text-xl font-heading mb-2">No Favorites Yet</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">Tap the heart on any property to save it for later viewing.</p>
                        <Button onClick={() => setCurrentScreen(Screen.HOME_SCREEN)} className="mt-8 max-w-[200px]">EXPLORE NOW</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MessagesScreen: React.FC = () => {
    const { setCurrentScreen, setActiveChatPartner } = useAppContext();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            // Simplified conversation fetching: get unique partners from messages
            const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (messages) {
                const partners = new Map<string, any>();
                messages.forEach((m: any) => {
                    const partnerId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
                    if (!partners.has(partnerId)) {
                        partners.set(partnerId, {
                            id: partnerId,
                            last_message: m.text,
                            partner_name: `Agent ${partnerId.substring(0, 4)}`,
                            partner_id: partnerId
                        });
                    }
                });
                setConversations(Array.from(partners.values()));
            }
            setLoading(false);
        };
        fetchConversations();
    }, []);

    return (
        <div className="flex flex-col h-full bg-secondary pb-20">
            <Header title="Conversations" />
            <div className="flex-grow overflow-y-auto scrollbar-hide">
                {loading ? (
                    <div className="p-10 flex justify-center"><LoaderIcon className="animate-spin text-primary" /></div>
                ) : conversations.length > 0 ? (
                    conversations.map(c => (
                        <div 
                            key={c.id} 
                            onClick={() => { setActiveChatPartner({ id: c.partner_id, name: c.partner_name }); setCurrentScreen(Screen.CHAT_ROOM); }}
                            className="bg-white p-5 border-b border-border-soft flex items-center gap-4 active:bg-secondary transition-colors"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-primary text-lg border border-primary/20 shrink-0 uppercase">
                                {c.partner_name[0]}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm truncate">{c.partner_name}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Today</span>
                                </div>
                                <p className="text-xs text-text-secondary truncate font-medium">{c.last_message}</p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-10">
                        <MessageSquareIcon className="w-16 h-16 text-gray-100 mb-6" />
                        <h3 className="font-bold text-xl font-heading mb-2">No Messages</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">Contact agents or landlords about listings to start a chat here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ProfileScreen: React.FC = () => {
    const { setCurrentScreen, userRole, setUserRole, setIsAuthenticated } = useAppContext();
    const [userName, setUserName] = useState('NyumbaNow User');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.email) {
                setUserName(user.email.split('@')[0]);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setCurrentScreen(Screen.LOGIN);
    };

    const toggleRole = () => {
        const newRole = userRole === UserRole.BUYER ? UserRole.SELLER : UserRole.BUYER;
        setUserRole(newRole);
        setCurrentScreen(newRole === UserRole.BUYER ? Screen.HOME_SCREEN : Screen.DASHBOARD);
    };

    return (
        <div className="flex flex-col h-full bg-secondary pb-20">
            <div className="p-10 pt-16 bg-white rounded-b-[48px] shadow-sm flex flex-col items-center text-center border-b border-border-soft">
                <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center mb-6 border-4 border-white shadow-xl">
                    <UserIcon className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-3xl font-bold font-heading mb-1 tracking-tight capitalize">{userName}</h2>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    {userRole} Account
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-border-soft">
                    <button onClick={() => setCurrentScreen(Screen.EDIT_PROFILE)} className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><UserIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm text-text-primary">Personal Details</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)} className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><BellIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm text-text-primary">Alert Settings</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.RULES_AND_POLICIES)} className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><ShieldCheckIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm text-text-primary">Safety & Verification</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.SETTINGS)} className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-xl"><SettingsIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm text-text-primary">Preferences</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.ABOUT)} className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><NyumbaNowLogo className="w-5 h-5" /></div>
                            <span className="font-bold text-sm text-text-primary">About NyumbaNow</span>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-300" />
                    </button>
                </div>

                <button 
                    onClick={toggleRole}
                    className="w-full bg-primary/5 p-6 rounded-[32px] border-2 border-dashed border-primary/30 flex items-center justify-between group hover:border-primary transition-all active:scale-95"
                >
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Switch Mode</p>
                        <p className="font-bold text-sm text-text-primary">Switch to {userRole === UserRole.BUYER ? 'Seller' : 'Buyer'} Hub</p>
                    </div>
                    <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <BriefcaseIcon className="w-5 h-5" />
                    </div>
                </button>

                <button onClick={handleLogout} className="w-full p-6 flex items-center justify-center gap-3 text-red-500 font-bold text-sm bg-red-50 rounded-[32px] hover:bg-red-100 transition-colors">
                    <LogOutIcon className="w-5 h-5" /> SIGN OUT
                </button>
                
                <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[4px] mt-10 pb-10">NyumbaNow Malawi</p>
            </div>
        </div>
    );
};

export const ChatRoomScreen: React.FC = () => {
    const { activeChatPartner, setCurrentScreen } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [myId, setMyId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const setup = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setMyId(user.id);
            
            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChatPartner?.id}),and(sender_id.eq.${activeChatPartner?.id},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });
            
            if (data) setMessages(data);

            const channel = supabase.channel('realtime_messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                    const newMsg = payload.new as Message;
                    if ((newMsg.sender_id === user.id && newMsg.receiver_id === activeChatPartner?.id) || 
                        (newMsg.sender_id === activeChatPartner?.id && newMsg.receiver_id === user.id)) {
                        setMessages(prev => [...prev, newMsg]);
                    }
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        };
        setup();
    }, [activeChatPartner]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !myId || !activeChatPartner) return;
        const msgText = input.trim();
        setInput('');
        
        // Optimistic UI for chat
        const tempId = Date.now();
        const optimisticMsg: Message = {
            id: tempId,
            sender_id: myId,
            receiver_id: activeChatPartner.id,
            text: msgText,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        const { error } = await supabase.from('messages').insert({ sender_id: myId, receiver_id: activeChatPartner.id, text: msgText });
        if (error) {
            alert('Message could not be sent.');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="p-4 border-b border-border-soft flex items-center bg-white sticky top-0 z-10 shadow-sm backdrop-blur-md">
                <button onClick={() => setCurrentScreen(Screen.MESSAGES)} className="mr-3 p-2 bg-secondary rounded-full">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-primary mr-3 uppercase border border-primary/20">
                    {activeChatPartner?.name[0]}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-sm tracking-tight">{activeChatPartner?.name}</h3>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Agent</p>
                    </div>
                </div>
                <button onClick={() => window.location.href=`tel:0999000000`} className="p-2 bg-blue-50 text-primary rounded-full">
                    <PhoneIcon className="w-5 h-5" />
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-6 pb-24 scrollbar-hide bg-secondary/20">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-50">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                            <ShieldCheckIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="max-w-[200px]">
                            <h4 className="font-bold text-sm mb-1 text-text-primary">Encrypted & Secure</h4>
                            <p className="text-[10px] font-medium leading-relaxed">Always visit houses in person with a friend. Never pay before viewing.</p>
                        </div>
                    </div>
                )}
                {messages.map((m) => {
                    const isMe = m.sender_id === myId;
                    return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-5 py-3 rounded-[24px] text-sm shadow-sm leading-relaxed ${
                                isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-text-primary rounded-tl-none border border-border-soft'
                            }`}>
                                {m.text}
                                <p className={`text-[9px] mt-2 font-bold opacity-60 flex items-center gap-1 justify-end uppercase tracking-widest`}>
                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-border-soft flex gap-2 items-center shadow-2xl">
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-grow bg-secondary px-6 py-4 rounded-[24px] outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
                />
                <button 
                    onClick={sendMessage}
                    className="p-4 bg-primary text-white rounded-[20px] transition-transform active:scale-90 shadow-xl shadow-primary/30"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export const BoostListingScreen: React.FC = () => {
    const { setCurrentScreen, selectedListing } = useAppContext();
    const [method, setMethod] = useState<'airtel' | 'tnm'>('airtel');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate Mobile Money Push Request
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
        }, 3000);
    };

    if (!selectedListing) return null;

    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Boost Listing" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
            <div className="p-6 flex-grow flex flex-col items-center">
                {step === 1 ? (
                    <>
                        <div className="bg-white p-8 rounded-[40px] shadow-sm text-center mb-8 w-full border border-amber-200">
                            <SunIcon className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
                            <h2 className="text-2xl font-bold font-heading mb-2">NyumbaBoost</h2>
                            <p className="text-sm text-text-secondary">Get 10x more inquiries by featuring your house at the top for 7 days.</p>
                            <div className="mt-6 p-4 bg-amber-50 rounded-2xl flex items-center justify-between font-bold border border-amber-100">
                                <span className="text-amber-700">Service Fee:</span>
                                <span className="text-amber-800 text-xl">MK 5,000</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4 mb-10">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Payment Method</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setMethod('airtel')}
                                    className={`p-6 rounded-3xl border-2 flex flex-col items-center transition-all ${method === 'airtel' ? 'border-primary bg-primary/5' : 'border-white bg-white shadow-sm'}`}
                                >
                                    <div className="w-10 h-10 bg-red-600 rounded-full mb-2 flex items-center justify-center font-bold text-white text-xs">A</div>
                                    <span className="font-bold text-xs">Airtel Money</span>
                                </button>
                                <button 
                                    onClick={() => setMethod('tnm')}
                                    className={`p-6 rounded-3xl border-2 flex flex-col items-center transition-all ${method === 'tnm' ? 'border-primary bg-primary/5' : 'border-white bg-white shadow-sm'}`}
                                >
                                    <div className="w-10 h-10 bg-orange-500 rounded-full mb-2 flex items-center justify-center font-bold text-white text-xs">T</div>
                                    <span className="font-bold text-xs">TNM Mpamba</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <input 
                                type="tel" 
                                placeholder="Enter Mobile Number" 
                                className="w-full bg-white p-5 rounded-[24px] shadow-sm outline-none font-bold text-center text-lg border-2 border-transparent focus:border-primary transition-all"
                            />
                            <p className="text-[10px] text-text-secondary text-center font-medium">We will send a USSD prompt to your phone to confirm.</p>
                        </div>
                        
                        <div className="flex-grow"></div>
                        <Button onClick={handlePayment} disabled={isProcessing} className="mb-4">
                            {isProcessing ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'CONFIRM & PAY'}
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircleIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading">Successfully Boosted!</h2>
                        <p className="text-sm text-text-secondary leading-relaxed">Your property is now featured at the top of search results in {selectedListing.location}.</p>
                        <Button onClick={() => setCurrentScreen(Screen.DASHBOARD)} variant="success">RETURN TO HUB</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const DashboardScreen: React.FC = () => {
     const { setCurrentScreen, setSelectedListing } = useAppContext();
     const [activeUnits, setActiveUnits] = useState<Listing[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchMine = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('listings').select('*').eq('seller_id', user.id).limit(2);
            if (data) setActiveUnits(data.map(i => ({ 
                ...i, 
                priceType: i.price_type, 
                imageUrl: i.image_url, 
                sellerId: i.seller_id, 
                sellerName: i.seller_name,
                isVerified: true
            })));
            setLoading(false);
        };
        fetchMine();
    }, []);

     return (
        <div className="flex flex-col h-full bg-secondary pb-20">
             <div className="p-8 pt-16 bg-white rounded-b-[48px] shadow-sm border-b border-border-soft">
                 <h1 className="text-4xl font-bold mb-1 font-heading tracking-tight">Seller Hub</h1>
                 <p className="text-text-secondary text-sm font-medium">Advertising in Lilongwe, Blantyre & Mzuzu.</p>
             </div>
             <div className="p-6 space-y-6">
                 {/* Stats */}
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft group transition-all hover:border-primary">
                        <p className="text-4xl font-bold text-primary mb-1">{activeUnits.length}</p>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Active Units</p>
                     </div>
                     <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft group transition-all hover:border-primary">
                        <p className="text-4xl font-bold text-primary mb-1">12</p>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Total Views</p>
                     </div>
                 </div>

                 {/* My Active Units Quick Boost */}
                 {activeUnits.length > 0 && (
                     <div className="space-y-4">
                         <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-sm tracking-tight">Promote Listings</h3>
                            <button onClick={() => setCurrentScreen(Screen.MANAGE_LISTINGS)} className="text-[10px] font-bold text-primary uppercase">See All</button>
                         </div>
                         {activeUnits.map(unit => (
                             <div key={unit.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-border-soft shadow-sm">
                                 <div className="flex items-center gap-3">
                                     <img src={unit.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                                     <div>
                                         <p className="font-bold text-xs truncate w-32">{unit.title}</p>
                                         <p className="text-[9px] text-text-secondary uppercase">Last updated: Today</p>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => { setSelectedListing(unit); setCurrentScreen(Screen.BOOST_LISTING); }}
                                    className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-bold border border-amber-100 flex items-center gap-2 hover:bg-amber-400 hover:text-white transition-all"
                                 >
                                     <SunIcon className="w-3.5 h-3.5" /> BOOST
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}

                 <button onClick={() => setCurrentScreen(Screen.BOOKINGS)} className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-border-soft flex items-center justify-between font-bold transition-all hover:border-primary active:scale-95">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><CalendarIcon className="w-5 h-5" /></div>
                        <span>Viewing Requests</span>
                    </div>
                    <div className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">NEW</div>
                 </button>
                 
                 <div className="bg-white rounded-[40px] p-8 text-center space-y-6 shadow-xl shadow-black/5 border border-border-soft">
                    <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                        <PlusCircleIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading">Ready to rent?</h2>
                    <p className="text-sm text-text-secondary leading-relaxed">Reach thousands of house hunters across Malawi in minutes.</p>
                    <button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} className="w-full bg-primary text-white py-5 rounded-[24px] font-bold shadow-2xl shadow-primary/30 transition-transform active:scale-95 flex items-center justify-center gap-3">
                        <PlusCircleIcon className="w-6 h-6" /> LIST NEW PROPERTY
                    </button>
                 </div>
                 
                 <button onClick={() => setCurrentScreen(Screen.MANAGE_LISTINGS)} className="w-full p-4 bg-white rounded-[24px] text-text-secondary font-bold text-xs uppercase tracking-widest border border-border-soft shadow-sm flex items-center justify-center gap-2">
                    <ListIcon className="w-4 h-4" /> Manage All Units
                 </button>
             </div>
        </div>
     );
};

export const AddListingScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [loc, setLoc] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const toggleAmenity = (name: string) => {
        setSelectedAmenities(prev => prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]);
    };

    const handlePost = async () => {
        if (!title || !price || !loc || images.length === 0) { alert("Please complete all main fields and add a photo."); return; }
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not logged in");
            
            const mainImg = await uploadImageToSupabase(images[0]);
            const { error } = await supabase.from('listings').insert({
                title, 
                description: desc, 
                price: parseFloat(price), 
                price_type: 'per month',
                location: loc, 
                category: ListingCategory.HOUSE_RENTAL, 
                image_url: mainImg, 
                seller_id: user.id, 
                seller_name: user.email?.split('@')[0] || 'Malawi Agent', 
                status: 'Available',
                bedrooms: parseInt(beds) || 0,
                bathrooms: parseInt(baths) || 0,
                amenities: selectedAmenities,
                is_verified: true 
            });
            if (error) throw error;
            setCurrentScreen(Screen.DASHBOARD);
        } catch (e: any) { alert("Failed to post: " + e.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            <Header title="New Listing" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
            <div className="flex-grow overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Media Upload</label>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {images.map((img, i) => (
                            <div key={i} className="relative shrink-0 transition-all hover:rotate-2">
                                <img src={img} className="w-28 h-28 rounded-[24px] object-cover shadow-xl border-4 border-white" />
                                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg border-2 border-white">X</button>
                            </div>
                        ))}
                        <button onClick={() => fileRef.current?.click()} className="w-28 h-28 bg-secondary border-4 border-dashed border-border-soft rounded-[24px] flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all gap-2">
                            <CameraIcon className="w-8 h-8" />
                            <span className="text-[10px] font-bold">ADD PHOTO</span>
                        </button>
                        <input type="file" hidden ref={fileRef} onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setImages([...images, ev.target?.result as string]);
                                reader.readAsDataURL(file);
                            }
                        }} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Title</label><input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" placeholder="E.g. 3 Bedroom House in Area 10" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Location</label><input value={loc} onChange={e => setLoc(e.target.value)} type="text" className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" placeholder="City, Area Name" /></div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Rent (MK)</label><input value={price} onChange={e => setPrice(e.target.value)} type="number" className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" placeholder="350000" /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Bedrooms</label><input value={beds} onChange={e => setBeds(e.target.value)} type="number" className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" placeholder="3" /></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Property Amenities</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Solar Backup', 'Borehole', 'Electric Fence', 'Secured Compound'].map((amenity, i) => (
                            <button key={i} onClick={() => toggleAmenity(amenity)} className={`p-4 rounded-[20px] text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 border-2 ${selectedAmenities.includes(amenity) ? 'bg-primary/5 text-primary border-primary' : 'bg-white text-gray-400 border-border-soft'}`}>
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Full Description</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-secondary p-5 rounded-[24px] outline-none resize-none h-40 font-medium text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Mention features like back yard, distance from main road, security details..." />
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-border-soft z-50 max-w-sm mx-auto">
                    <Button onClick={handlePost} disabled={loading} className="py-5 rounded-[24px] shadow-2xl shadow-primary/40">
                        {loading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'PUBLISH LISTING'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const NotificationsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Alerts" onBack={() => setCurrentScreen(Screen.HOME_SCREEN)} />
             <div className="p-4 space-y-4">
                 <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
                     <div className="flex items-center gap-3 mb-3">
                         <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,102,255,0.8)]"></div>
                         <h4 className="font-bold text-primary tracking-tight">System Update</h4>
                     </div>
                     <p className="text-sm text-text-secondary font-medium leading-relaxed">Property verification is now active! Look for the blue shield to find trusted agents.</p>
                     <p className="text-[9px] font-bold text-gray-300 mt-4 uppercase tracking-widest tracking-tighter">NYUMBANOW MALAWi • 2 HOURS AGO</p>
                 </div>
             </div>
        </div>
    );
};

export const RulesAndPoliciesScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Safety Guide" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="p-6 space-y-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm space-y-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit"><ShieldCheckIcon className="w-8 h-8" /></div>
                    <h3 className="font-bold text-xl font-heading text-red-600">Avoid Scams</h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">1. Never pay viewing fees unless you trust the agent.<br/>2. Always visit the property in person.<br/>3. Verify ID of the agent/landlord before signing.<br/>4. Pay through traceable bank transfers where possible.</p>
                </div>
            </div>
        </div>
    );
};

export const SettingsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
            <Header title="Settings" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="p-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm space-y-8">
                    <div className="flex justify-between items-center"><span className="font-bold text-lg">Push Notifications</span><div className="w-14 h-7 bg-primary rounded-full relative p-1 transition-all"><div className="w-5 h-5 bg-white rounded-full absolute right-1"></div></div></div>
                    <div className="flex justify-between items-center opacity-50"><span className="font-bold text-lg">Dark Mode</span><div className="w-14 h-7 bg-gray-200 rounded-full relative p-1 transition-all"><div className="w-5 h-5 bg-white rounded-full"></div></div></div>
                </div>
            </div>
        </div>
    );
};

export const AboutScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-secondary">
             <Header title="Our Story" onBack={() => setCurrentScreen(Screen.PROFILE)} />
             <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                 <NyumbaNowLogo className="text-primary w-28 h-28 mb-8" />
                 <h2 className="text-3xl font-bold mb-3 font-heading tracking-tight">NyumbaNow</h2>
                 <p className="text-text-secondary font-medium leading-relaxed italic">The most modern way to find a home in the Heart of Africa.</p>
                 <div className="mt-16 space-y-3">
                     <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[4px]">Serving Malawi</p>
                     <p className="text-xs font-bold text-primary">Lilongwe • Blantyre • Mzuzu</p>
                 </div>
                 <p className="mt-24 text-[10px] text-gray-300 font-bold uppercase tracking-widest">v2.0.1 Stable Build</p>
             </div>
        </div>
    );
};

export const EditProfileScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Edit Profile" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="p-10 flex flex-col items-center space-y-12">
                <div className="relative">
                    <div className="w-40 h-40 bg-secondary rounded-[48px] flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden group">
                        <UserIcon className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <button className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-[20px] shadow-2xl border-4 border-white transition-transform active:scale-90"><CameraIcon className="w-6 h-6" /></button>
                </div>
                <div className="w-full space-y-8">
                    <div className="space-y-2"><label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Full Name</label><input type="text" className="w-full border-b-2 border-border-soft py-3 outline-none font-bold text-xl focus:border-primary transition-colors" defaultValue="NyumbaNow User" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Phone Number</label><input type="tel" className="w-full border-b-2 border-border-soft py-3 outline-none font-bold text-xl focus:border-primary transition-colors" defaultValue="+265 999 000 000" /></div>
                </div>
                <Button onClick={() => setCurrentScreen(Screen.PROFILE)} className="py-5 rounded-[24px] shadow-2xl shadow-primary/30">SAVE ALL CHANGES</Button>
            </div>
        </div>
    );
};

export const ManageListingsScreen: React.FC = () => {
    const { setCurrentScreen, setSelectedListing } = useAppContext();
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMine = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('listings').select('*').eq('seller_id', user.id);
            if (data) setMyListings(data.map(i => ({ 
                ...i, 
                priceType: i.price_type, 
                imageUrl: i.image_url, 
                sellerId: i.seller_id, 
                sellerName: i.seller_name,
                isVerified: true
            })));
            setLoading(false);
        };
        fetchMine();
    }, []);

    return (
        <div className="flex flex-col h-full bg-secondary">
             <Header title="My Property List" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
             <div className="p-4 flex-grow overflow-y-auto scrollbar-hide">
                 {loading ? <div className="flex justify-center p-20"><LoaderIcon className="animate-spin text-primary" /></div> : myListings.length > 0 ? (
                     myListings.map(l => (
                        <div key={l.id} className="relative">
                            <ListingCard listing={l} onClick={() => {}} />
                            {!l.is_promoted && (
                                <button 
                                    onClick={() => { setSelectedListing(l); setCurrentScreen(Screen.BOOST_LISTING); }}
                                    className="absolute top-4 right-4 bg-amber-400 text-white p-2 rounded-xl shadow-lg flex items-center gap-1 font-bold text-[10px]"
                                >
                                    <SunIcon className="w-4 h-4" /> BOOST
                                </button>
                            )}
                        </div>
                     ))
                 ) : (
                    <div className="p-12 text-center text-text-secondary pt-24 bg-white rounded-[40px] border border-border-soft m-4">
                        <HouseIcon className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <h3 className="font-bold text-lg">No Listings</h3>
                        <p className="text-sm mt-2 mb-6">You haven't added any properties for rent yet.</p>
                        <button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} className="text-primary font-bold text-xs uppercase tracking-widest">Create First Listing</button>
                    </div>
                 )}
             </div>
        </div>
    );
};
