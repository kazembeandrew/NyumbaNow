
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Review, ListingCategory, Message, Conversation, Booking } from '../types';
import { NyumbaNowLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, MapIcon, ListIcon, PhoneIcon, SendIcon, ChevronRightIcon, SettingsIcon, LogOutIcon, PlusCircleIcon, CameraIcon, LoaderIcon, ArrowDownIcon, SortIcon, ChevronDownIcon, StarIcon, MailIcon, HouseIcon, CarIcon, BriefcaseIcon, ShieldCheckIcon, DropletsIcon, SunIcon, FilterIcon, CalendarIcon, ClockIcon, CheckCircleIcon, WhatsAppIcon, AirtelLogo, TNMLogo } from '../constants';
import { Button, ListingCard, Header, StarRating, ReviewCard, ListingSkeleton } from './ui';
import { supabase } from '../supabaseClient';
import { useListings } from '../hooks/useListings';
import { authService } from '../services/authService';
import { profileService, Profile } from '../services/profileService';

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
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        if (phone.length < 9) { 
            setError("Enter a valid Malawi phone number."); 
            return; 
        }
        setIsLoading(true); setError(''); setMessage('');
        try {
            await authService.signInWithPhone(phone);
            setStep('otp');
            setMessage('A verification code has been sent via SMS.');
        } catch (err: any) { 
            setError(err.message || 'Check your internet and try again.'); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) return;
        setIsLoading(true); setError('');
        try {
            await authService.verifyOTP(phone, otp);
            setIsAuthenticated(true);
            setCurrentScreen(Screen.ROLE_SELECTION);
        } catch (err: any) {
            setError('The code is incorrect. Please check your SMS again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsAppLogin = () => {
        setError("WhatsApp verification is currently coming soon.");
    };

    return (
        <div className="p-8 flex flex-col h-full bg-white">
            <div className="flex-grow flex flex-col justify-center">
                <div className="mb-12 text-center">
                    <NyumbaNowLogo className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="font-heading text-3xl font-bold text-text-primary tracking-tight">NyumbaNow</h1>
                    <p className="text-text-secondary text-sm mt-2">Connecting Malawi to safe homes.</p>
                </div>

                {step === 'phone' ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Your Phone Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border-soft pr-3">
                                    <span className="text-sm font-bold text-text-primary">+265</span>
                                </div>
                                <input 
                                    type="tel" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} 
                                    placeholder="888 123 456" 
                                    className="w-full pl-20 pr-4 py-5 rounded-[24px] bg-secondary border-2 border-transparent focus:border-primary outline-none font-bold text-lg transition-all" 
                                />
                            </div>
                            <div className="flex gap-4 mt-3 px-2">
                                <div className="flex items-center gap-1.5 opacity-60"><AirtelLogo className="w-4 h-4" /><span className="text-[10px] font-bold">Airtel</span></div>
                                <div className="flex items-center gap-1.5 opacity-60"><TNMLogo className="w-4 h-4" /><span className="text-[10px] font-bold">TNM</span></div>
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold px-2">{error}</p>}

                        <Button onClick={handleSendOTP} disabled={isLoading}>
                            {isLoading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'GET VERIFICATION CODE'}
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-soft"></div></div>
                            <div className="relative flex justify-center text-xs uppercase font-bold text-gray-300 px-2 bg-white w-fit mx-auto">Or</div>
                        </div>

                        <button onClick={handleWhatsAppLogin} className="w-full bg-[#25D366] text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                            <WhatsAppIcon className="w-6 h-6" /> LOGIN VIA WHATSAPP
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center">
                            <h2 className="text-xl font-bold">Check your SMS</h2>
                            <p className="text-xs text-text-secondary mt-1">We sent a 6-digit code to +265 {phone}</p>
                        </div>

                        <div>
                            <input 
                                type="text" 
                                maxLength={6}
                                value={otp} 
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                                placeholder="0 0 0 0 0 0" 
                                className="w-full px-4 py-5 rounded-[24px] bg-secondary border-2 border-transparent focus:border-primary outline-none font-bold text-2xl text-center tracking-[0.5em] transition-all" 
                            />
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold px-2 text-center">{error}</p>}
                        {message && <p className="text-[10px] text-primary font-bold px-2 text-center">{message}</p>}

                        <Button onClick={handleVerifyOTP} disabled={isLoading || otp.length < 6}>
                            {isLoading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'VERIFY & CONTINUE'}
                        </Button>

                        <button onClick={() => setStep('phone')} className="w-full text-xs font-bold text-primary text-center uppercase tracking-widest">Change Phone Number</button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-text-secondary leading-relaxed font-medium">By continuing, you agree to our Terms. <br/><span className="text-red-500 font-bold">Never share your Mobile Money PIN with anyone.</span></p>
                <button onClick={() => { setIsAuthenticated(false); setCurrentScreen(Screen.HOME_SCREEN); }} className="mt-6 text-[10px] text-gray-300 font-bold underline">Continue as Guest</button>
            </div>
        </div>
    );
};

export const RoleSelectionScreen: React.FC = () => {
    const { setUserRole, setCurrentScreen } = useAppContext();
    const handleSelect = (role: UserRole) => {
        setUserRole(role);
        setCurrentScreen(role === UserRole.BUYER ? Screen.HOME_SCREEN : Screen.DASHBOARD);
    };
    return (
        <div className="p-8 flex flex-col h-full bg-white">
            <Header title="Who are you?" />
            <div className="flex-grow flex flex-col justify-center gap-6">
                <div onClick={() => handleSelect(UserRole.BUYER)} className="p-6 bg-secondary rounded-[32px] border-2 border-transparent hover:border-primary transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <HouseIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">I want a Home</h3>
                    <p className="text-sm text-text-secondary">Find verified rentals and properties for sale across Malawi.</p>
                </div>
                <div onClick={() => handleSelect(UserRole.SELLER)} className="p-6 bg-secondary rounded-[32px] border-2 border-transparent hover:border-primary transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PlusCircleIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">I am a Landlord</h3>
                    <p className="text-sm text-text-secondary">List your property and reach thousands of verified tenants quickly.</p>
                </div>
            </div>
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const { listings, loading } = useListings();
    const { setSelectedListing, setCurrentScreen } = useAppContext();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const cities = ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'];

    const filteredListings = listings.filter(l => {
        const matchesCity = !selectedCity || l.location.toLowerCase().includes(selectedCity.toLowerCase());
        const matchesSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesSearch;
    });

    return (
        <div className="bg-secondary min-h-full">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <NyumbaNowLogo className="w-8 h-8 text-primary" />
                        <span className="font-heading font-bold text-xl tracking-tight">NyumbaNow</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)} className="p-2 bg-secondary rounded-full relative">
                            <BellIcon className="w-5 h-5 text-text-primary" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                        </button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-secondary rounded-2xl flex items-center px-4 py-3">
                        <MapPinIcon className="w-4 h-4 text-text-secondary mr-2" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search area (e.g. Area 10, Nyambadwe)" 
                            className="bg-transparent border-none outline-none text-sm font-medium w-full" 
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {cities.map(city => (
                            <button 
                                key={city}
                                onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                                    selectedCity === city 
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                    : 'bg-white text-text-secondary border-border-soft'
                                }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center mb-2 px-1">
                    <h2 className="font-heading text-lg font-bold">
                        {selectedCity ? `${selectedCity} Properties` : 'Featured Properties'}
                    </h2>
                    <span className="text-[10px] font-bold text-text-secondary uppercase">{filteredListings.length} results</span>
                </div>
                
                {loading ? (
                    Array(3).fill(0).map((_, i) => <ListingSkeleton key={i} />)
                ) : filteredListings.length > 0 ? (
                    filteredListings.map(l => (
                        <ListingCard 
                            key={l.id} 
                            listing={l} 
                            onClick={() => { setSelectedListing(l); setCurrentScreen(Screen.LISTING_DETAILS); }} 
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-border-soft m-4 p-8">
                        <HouseIcon className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="font-bold text-lg">No Results</h3>
                        <p className="text-sm text-text-secondary mt-2">Try adjusting your filters or area search.</p>
                        <button onClick={() => {setSelectedCity(null); setSearchQuery('');}} className="mt-4 text-primary font-bold text-xs uppercase underline">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ListingDetailsScreen: React.FC = () => {
    const { selectedListing, setCurrentScreen } = useAppContext();
    if (!selectedListing) return null;

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Hi, I saw your listing "${selectedListing.title}" on NyumbaNow. Is it still available?`);
        window.open(`https://wa.me/${selectedListing.phoneNumber?.replace(/\D/g, '') || '265999000000'}?text=${text}`, '_blank');
    };

    return (
        <div className="bg-white min-h-full pb-32">
            <Header title="Property Details" onBack={() => setCurrentScreen(Screen.HOME_SCREEN)} />
            <div className="h-64 bg-secondary relative">
                <img src={selectedListing.imageUrl} className="w-full h-full object-cover" alt={selectedListing.title} />
                {selectedListing.isVerified && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary/20 shadow-xl">
                        <ShieldCheckIcon className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase">Verified Agent</span>
                    </div>
                )}
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold flex-grow pr-4">{selectedListing.title}</h1>
                    <div className="text-primary text-xl font-bold shrink-0">MK {selectedListing.price.toLocaleString()}</div>
                </div>
                
                <div className="flex items-center text-text-secondary text-sm mb-6 font-medium">
                    <MapPinIcon className="w-4 h-4 mr-1.5 text-primary" />
                    {selectedListing.location}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-secondary/50 p-4 rounded-2xl flex items-center gap-3 border border-border-soft">
                        <BedIcon className="w-5 h-5 text-primary" />
                        <div>
                            <div className="text-[10px] font-bold uppercase text-text-secondary">Bedrooms</div>
                            <div className="font-bold">{selectedListing.bedrooms || 0} Rooms</div>
                        </div>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-2xl flex items-center gap-3 border border-border-soft">
                        <BathIcon className="w-5 h-5 text-primary" />
                        <div>
                            <div className="text-[10px] font-bold uppercase text-text-secondary">Bathrooms</div>
                            <div className="font-bold">{selectedListing.bathrooms || 0} Baths</div>
                        </div>
                    </div>
                </div>
                
                <h3 className="font-bold mb-3 font-heading">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-8">{selectedListing.description}</p>
                
                <div className="p-5 bg-secondary rounded-[32px] border border-border-soft flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-primary shadow-sm">
                        {selectedListing.sellerName[0]}
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-sm">{selectedListing.sellerName}</h4>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">Landlord / Agent</p>
                    </div>
                    <button onClick={handleWhatsApp} className="p-3 bg-[#25D366] text-white rounded-2xl shadow-lg shadow-green-500/20 active:scale-90 transition-transform">
                        <WhatsAppIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border-soft flex gap-3 z-20">
                <a href={`tel:${selectedListing.phoneNumber || '0999000000'}`} className="flex-1 bg-secondary text-text-primary py-4 rounded-[20px] font-bold text-center border border-border-soft active:scale-95 transition-all">CALL</a>
                <Button onClick={() => setCurrentScreen(Screen.CHAT_ROOM)} className="flex-[2] shadow-xl shadow-primary/30">MESSAGE IN APP</Button>
            </div>
        </div>
    );
};

export const FavoritesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Saved Listings" />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <HeartIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No saved homes yet</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Tap the heart on any property to save it for later.</p>
        </div>
    </div>
);

export const MessagesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Messages" />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <MessageSquareIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Your messages with landlords and agents will appear here.</p>
        </div>
    </div>
);

export const ChatRoomScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header title="Chat with Agent" onBack={() => setCurrentScreen(Screen.MESSAGES)} />
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                <div className="bg-white p-4 rounded-[24px] rounded-tl-none max-w-[85%] shadow-sm border border-border-soft">
                    <p className="text-sm leading-relaxed">Zikomo! How can I help you with this property in Area 47? Physical viewings are available today.</p>
                    <span className="text-[9px] font-bold text-gray-300 uppercase mt-2 block">Agent • 10:45 AM</span>
                </div>
            </div>
            <div className="p-4 bg-white border-t border-border-soft flex gap-2 items-center">
                <input className="flex-grow bg-secondary rounded-[20px] px-6 py-4 outline-none font-medium text-sm" placeholder="Type a message..." />
                <button className="bg-primary text-white p-4 rounded-[20px] shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export const ProfileScreen: React.FC = () => {
    const { setCurrentScreen, setIsAuthenticated, userRole } = useAppContext();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        profileService.getMyProfile().then(p => {
            setProfile(p);
            setLoading(false);
        });
    }, []);

    return (
        <div className="h-full flex flex-col bg-secondary">
            <div className="bg-white p-8 pt-16 rounded-b-[48px] shadow-sm flex flex-col items-center text-center border-b border-border-soft">
                <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center mb-6 border-4 border-white shadow-xl overflow-hidden">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon className="w-12 h-12 text-gray-300" />
                    )}
                </div>
                <h3 className="text-2xl font-bold font-heading mb-1 capitalize">
                    {loading ? 'Loading...' : (profile?.full_name || 'NyumbaNow User')}
                </h3>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    {userRole} Account
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-border-soft">
                    <button onClick={() => setCurrentScreen(Screen.EDIT_PROFILE)} className="w-full flex items-center justify-between p-6 hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><UserIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm">Personal Details</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.BOOKINGS)} className="w-full flex items-center justify-between p-6 hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><CalendarIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm">My Bookings</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.SETTINGS)} className="w-full flex items-center justify-between p-6 hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-50 text-gray-600 rounded-xl"><SettingsIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm">App Settings</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                    </button>
                </div>

                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-border-soft">
                    <button onClick={() => setCurrentScreen(Screen.RULES_AND_POLICIES)} className="w-full flex items-center justify-between p-6 hover:bg-secondary transition-colors border-b border-border-soft">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><ShieldCheckIcon className="w-5 h-5" /></div>
                            <span className="font-bold text-sm">Safety Guide</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => setCurrentScreen(Screen.ABOUT)} className="w-full flex items-center justify-between p-6 hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><NyumbaNowLogo className="w-5 h-5" /></div>
                            <span className="font-bold text-sm">About NyumbaNow</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                    </button>
                </div>

                <button 
                    onClick={async () => { await authService.signOut(); setIsAuthenticated(false); setCurrentScreen(Screen.LOGIN); }} 
                    className="w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-red-500 rounded-[32px] font-bold active:scale-95 transition-all"
                >
                    <LogOutIcon className="w-5 h-5" /> SIGN OUT
                </button>
            </div>
        </div>
    );
};

export const DashboardScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    return (
        <div className="h-full flex flex-col bg-secondary pb-20">
            <div className="p-8 pt-16 bg-white rounded-b-[48px] shadow-sm border-b border-border-soft">
                 <h1 className="text-4xl font-bold mb-1 font-heading tracking-tight">Seller Hub</h1>
                 <p className="text-text-secondary text-sm font-medium">Manage your properties in Malawi.</p>
             </div>
            <div className="p-6 space-y-6">
                <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
                    <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Active Listings</div>
                    <div className="text-5xl font-bold mb-6">0</div>
                    <button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} className="w-full bg-white text-primary py-4 rounded-2xl font-bold text-sm uppercase tracking-tight flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <PlusCircleIcon className="w-5 h-5" /> ADD NEW UNIT
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Total Views</div>
                        <div className="text-3xl font-bold">0</div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Active Leads</div>
                        <div className="text-3xl font-bold">0</div>
                    </div>
                </div>

                <button onClick={() => setCurrentScreen(Screen.MANAGE_LISTINGS)} className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-border-soft flex items-center justify-between font-bold group hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-xl text-text-primary group-hover:bg-primary group-hover:text-white transition-colors"><ListIcon className="w-5 h-5" /></div>
                        <span>Manage My Listings</span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                </button>
            </div>
        </div>
    );
};

export const AddListingScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [loading, setLoading] = useState(false);
    
    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <Header title="Add New House" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
            <div className="flex-grow overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
                <div className="w-full aspect-video bg-secondary rounded-[32px] flex flex-col items-center justify-center border-4 border-dashed border-border-soft group hover:border-primary transition-all cursor-pointer">
                    <CameraIcon className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors mb-3" />
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Add Main Photo</span>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Title</label>
                        <input className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" placeholder="E.g. 3 Bedroom House in Area 10" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">City</label>
                        <select className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-lg bg-transparent">
                            <option>Lilongwe</option>
                            <option>Blantyre</option>
                            <option>Mzuzu</option>
                            <option>Zomba</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Monthly Rent (MK)</label>
                            <input className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" type="number" placeholder="350000" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Bedrooms</label>
                            <input className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary transition-colors font-bold text-xl" type="number" placeholder="3" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Description</label>
                        <textarea className="w-full bg-secondary p-5 rounded-[24px] outline-none font-medium text-sm h-40 resize-none" placeholder="Details about the fence, water source, yard size..."></textarea>
                    </div>
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-border-soft z-10 max-w-sm mx-auto">
                    <Button onClick={() => {setLoading(true); setTimeout(() => {setLoading(false); setCurrentScreen(Screen.DASHBOARD);}, 1500);}} disabled={loading}>
                        {loading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'PUBLISH LISTING'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const ManageListingsScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="My Property Portfolio" onBack={() => Screen.DASHBOARD} />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <ListIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No active listings</h3>
            <p className="text-sm text-text-secondary leading-relaxed">You haven't added any houses for rent yet.</p>
        </div>
    </div>
);

export const NotificationsScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Alerts & Updates" onBack={() => Screen.HOME_SCREEN} />
        <div className="p-4 space-y-4">
            <div className="p-6 bg-white rounded-[32px] border border-border-soft shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary"></div>
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-sm tracking-tight">Security Tip</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">Never pay a viewing fee before seeing the property in person. Be safe!</p>
                <span className="text-[9px] font-bold text-gray-300 uppercase mt-4 block">NyumbaNow • Just now</span>
            </div>
        </div>
    </div>
);

export const RulesAndPoliciesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white">
        <Header title="Safety Guide" />
        <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
            <div className="space-y-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit"><ShieldCheckIcon className="w-8 h-8" /></div>
                <h3 className="font-bold text-2xl font-heading text-text-primary">Stay Safe while Renting</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">1. **Physical Viewings**: Always visit houses during the day with a friend.<br/>2. **Direct Payments**: Only pay rent after signing a formal lease agreement.<br/>3. **ID Check**: Ask for the agent's ID card if they claim to be from an agency.</p>
            </div>
            <div className="space-y-4">
                <div className="p-3 bg-blue-50 text-primary rounded-2xl w-fit"><CheckCircleIcon className="w-8 h-8" /></div>
                <h3 className="font-bold text-xl font-heading text-text-primary">Verified Agents</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">Listings with the blue shield have been manually vetted by our team in Lilongwe.</p>
            </div>
        </div>
    </div>
);

export const SettingsScreen: React.FC = () => {
    const { dataSaverMode, setDataSaverMode, setCurrentScreen } = useAppContext();
    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header title="App Preferences" onBack={() => Screen.PROFILE} />
            <div className="p-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-bold text-lg block">Data Saver Mode</span>
                            <span className="text-[10px] text-text-secondary font-medium uppercase">Hide images for faster loading</span>
                        </div>
                        <button 
                            onClick={() => setDataSaverMode(!dataSaverMode)}
                            className={`w-14 h-7 rounded-full relative p-1 transition-all ${dataSaverMode ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute transition-all ${dataSaverMode ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AboutScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white items-center justify-center p-12 text-center">
        <NyumbaNowLogo className="w-24 h-24 text-primary mb-8" />
        <h2 className="text-3xl font-bold font-heading mb-4 tracking-tight">NyumbaNow Malawi</h2>
        <p className="text-text-secondary font-medium leading-relaxed italic">The Heart of Africa's most modern house rental platform.</p>
        <div className="mt-16 space-y-2">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[6px]">Version 1.0.2</p>
            <p className="text-xs font-bold text-primary">Proudly built for Malawi 🇲🇼</p>
        </div>
    </div>
);

export const EditProfileScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await profileService.updateProfile({ full_name: name });
            setCurrentScreen(Screen.PROFILE);
        } catch (e) {
            alert('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <Header title="Update Profile" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="p-10 flex flex-col items-center gap-12">
                <div className="w-32 h-32 bg-secondary rounded-[40px] flex items-center justify-center border-4 border-white shadow-xl relative">
                    <UserIcon className="w-12 h-12 text-gray-300" />
                    <button className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 border-2 border-white"><CameraIcon className="w-4 h-4" /></button>
                </div>
                <div className="w-full space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full border-b-2 border-border-soft py-4 outline-none font-bold text-xl focus:border-primary transition-colors" placeholder="Enter your name" />
                    </div>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'SAVE CHANGES'}
                </Button>
            </div>
        </div>
    );
};

export const BookingsScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="My Viewing Tours" />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <CalendarIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No active tours</h3>
            <p className="text-sm text-text-secondary leading-relaxed">Booked viewings with agents will appear here.</p>
        </div>
    </div>
);

export const BoostListingScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white">
        <Header title="Get Featured" />
        <div className="p-8 flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[32px] flex items-center justify-center animate-pulse"><SunIcon className="w-10 h-10" /></div>
            <h2 className="text-3xl font-bold font-heading tracking-tight">NyumbaBoost</h2>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">Featured properties get 10x more leads in Lilongwe and Blantyre.</p>
            <div className="w-full p-6 bg-amber-50 rounded-[32px] border-2 border-amber-200 border-dashed text-amber-800 font-bold text-lg">
                MK 5,000 / Week
            </div>
            <Button onClick={() => {}} className="bg-amber-500 hover:bg-amber-600 shadow-amber-500/30">BOOST NOW (MOBILE MONEY)</Button>
            <p className="text-[10px] text-text-secondary font-bold uppercase">Pay via Airtel Money or TNM Mpamba</p>
        </div>
    </div>
);
