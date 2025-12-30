
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Screen, UserRole, Listing, Message, Booking } from '../types';
import { NyumbaNowLogo, HeartIcon, MessageSquareIcon, BellIcon, UserIcon, ChevronLeftIcon, MapPinIcon, BedIcon, BathIcon, ListIcon, PhoneIcon, SendIcon, ChevronRightIcon, SettingsIcon, LogOutIcon, PlusCircleIcon, CameraIcon, LoaderIcon, StarIcon, HouseIcon, ShieldCheckIcon, ClockIcon, WhatsAppIcon, AirtelLogo, TNMLogo, CalendarIcon, SunIcon, CheckCircleIcon } from '../constants';
import { Button, ListingCard, Header, ListingSkeleton } from './ui';
import { supabase } from '../supabaseClient';
import { useListings } from '../hooks/useListings';
import { authService } from '../services/authService';
import { profileService, Profile } from '../services/profileService';
import { listingService } from '../services/listingService';
import { bookingService } from '../services/bookingService';
import { aiService } from '../services/aiService';
import { chatService } from '../services/chatService';
import { GoogleGenAI } from "@google/genai";

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
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        if (phone.length < 9) { setError("Enter a valid Malawi phone number."); return; }
        setIsLoading(true); setError('');
        try {
            await authService.signInWithPhone(phone);
            setStep('otp');
        } catch (err: any) { setError(err.message || 'Check connection.'); } finally { setIsLoading(false); }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) return;
        setIsLoading(true); setError('');
        try {
            await authService.verifyOTP(phone, otp);
            setIsAuthenticated(true);
            setCurrentScreen(Screen.ROLE_SELECTION);
        } catch (err: any) { setError('Incorrect code.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="p-8 flex flex-col h-full bg-white justify-center">
            <div className="mb-12 text-center">
                <NyumbaNowLogo className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-heading text-3xl font-bold text-text-primary tracking-tight">NyumbaNow</h1>
            </div>
            {step === 'phone' ? (
                <div className="space-y-6">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold border-r pr-3">+265</div>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="888 123 456" className="w-full pl-20 pr-4 py-5 rounded-[24px] bg-secondary font-bold text-lg" />
                    </div>
                    {error && <p className="text-xs text-red-500 font-bold px-2">{error}</p>}
                    <Button onClick={handleSendOTP} disabled={isLoading}>{isLoading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'GET CODE'}</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="0 0 0 0 0 0" className="w-full py-5 rounded-[24px] bg-secondary font-bold text-2xl text-center tracking-[0.5em]" />
                    <Button onClick={handleVerifyOTP} disabled={isLoading || otp.length < 6}>VERIFY</Button>
                </div>
            )}
        </div>
    );
};

export const HomeScreen: React.FC = () => {
    const { listings, loading } = useListings();
    const { setSelectedListing, setCurrentScreen } = useAppContext();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    return (
        <div className="bg-secondary min-h-full pb-24">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm rounded-b-[32px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <NyumbaNowLogo className="w-8 h-8 text-primary" />
                        <span className="font-heading font-bold text-xl tracking-tight">NyumbaNow</span>
                    </div>
                    <button onClick={() => setCurrentScreen(Screen.NOTIFICATIONS)} className="p-2 bg-secondary rounded-full relative">
                        <BellIcon className="w-5 h-5" />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                    </button>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'].map(city => (
                        <button key={city} onClick={() => setSelectedCity(selectedCity === city ? null : city)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${selectedCity === city ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border-soft'}`}>{city}</button>
                    ))}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {loading ? <ListingSkeleton /> : listings.map(l => <ListingCard key={l.id} listing={l} onClick={() => { setSelectedListing(l); setCurrentScreen(Screen.LISTING_DETAILS); }} />)}
            </div>

            <button 
                onClick={() => setCurrentScreen(Screen.AI_SEARCH)}
                className="fixed bottom-24 right-6 bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2 animate-bounce hover:animate-none active:scale-95 transition-all"
            >
                <SunIcon className="w-6 h-6 fill-current text-white" />
                <span className="font-bold text-xs uppercase tracking-widest">Ask NyumbaAI</span>
            </button>
        </div>
    );
};

export const AISearchScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, links?: any[] }[]>([
        { role: 'ai', content: "Muli bwanji! I'm NyumbaAI. I can help you find neighborhoods and homes in Malawi. What are you looking for?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleAsk = async () => {
        if (!query.trim()) return;
        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        const result = await aiService.getNeighborhoodAdvice(userMsg);
        setMessages(prev => [...prev, { role: 'ai', content: result.text, links: result.links }]);
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col bg-secondary overflow-hidden">
            <Header title="NyumbaAI Assistant" onBack={() => setCurrentScreen(Screen.HOME_SCREEN)} />
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 pb-12">
                {messages.map((m, i) => (
                    <div key={i} className={`max-w-[85%] p-4 rounded-[24px] ${m.role === 'user' ? 'bg-primary text-white ml-auto rounded-tr-none shadow-lg' : 'bg-white text-text-primary mr-auto rounded-tl-none border border-border-soft'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        {m.links && m.links.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border-soft space-y-2">
                                {m.links.map((link, j) => (
                                    <a key={j} href={link.uri} target="_blank" className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest">
                                        <MapPinIcon className="w-3 h-3" /> {link.title || "View on Map"}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="bg-white p-4 rounded-[24px] rounded-tl-none mr-auto border border-border-soft flex items-center gap-2">
                        <LoaderIcon className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">AI is thinking...</span>
                    </div>
                )}
            </div>
            <div className="p-4 bg-white border-t border-border-soft flex gap-2 items-center">
                <input 
                    value={query} 
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask about areas, safety, or rent..." 
                    className="flex-grow bg-secondary rounded-[20px] px-6 py-4 outline-none font-medium text-sm" 
                />
                <button onClick={handleAsk} disabled={loading} className="bg-primary text-white p-4 rounded-[20px] shadow-lg active:scale-90 transition-transform disabled:opacity-50">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export const ChatRoomScreen: React.FC = () => {
    const { setCurrentScreen, selectedListing } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedListing) return;
        
        chatService.getOrCreateConversation(selectedListing.id, selectedListing.sellerId).then(id => {
            setConversationId(id);
            setLoading(false);
            
            const subscription = chatService.subscribeToMessages(id, (msg) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            });

            return () => { subscription.unsubscribe(); };
        });
    }, [selectedListing]);

    const handleSend = async () => {
        if (!text.trim() || !conversationId) return;
        const msgText = text;
        setText('');
        await chatService.sendMessage(conversationId, msgText);
    };

    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header 
                title={selectedListing?.sellerName || "Chat"} 
                onBack={() => setCurrentScreen(Screen.HOME_SCREEN)} 
                rightAction={<a href={`tel:${selectedListing?.phoneNumber}`} className="p-2 bg-emerald-100 text-emerald-600 rounded-full"><PhoneIcon className="w-4 h-4" /></a>}
            />
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[75%] p-4 rounded-[20px] ${m.sender_id === supabase.auth.getUser() ? 'bg-primary text-white ml-auto rounded-tr-none' : 'bg-white text-text-primary mr-auto rounded-tl-none shadow-sm'}`}>
                        <p className="text-sm">{m.text}</p>
                    </div>
                ))}
                {loading && <div className="text-center py-4"><LoaderIcon className="animate-spin mx-auto text-primary" /></div>}
            </div>
            <div className="p-4 bg-white border-t border-border-soft flex gap-2 items-center">
                <input 
                    value={text} 
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about details..." 
                    className="flex-grow bg-secondary rounded-full px-6 py-4 outline-none text-sm" 
                />
                <button onClick={handleSend} className="bg-primary text-white p-4 rounded-full shadow-lg active:scale-90 transition-transform">
                    <SendIcon className="w-5 h-5" />
                </button>
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
        <div className="p-8 flex flex-col h-full bg-white justify-center gap-6">
            <Header title="Who are you?" />
            <div onClick={() => handleSelect(UserRole.BUYER)} className="p-8 bg-secondary rounded-[32px] border-2 border-transparent hover:border-primary transition-all cursor-pointer group text-center">
                <HouseIcon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold">I want a Home</h3>
                <p className="text-xs text-text-secondary mt-2">Find verified rentals in Lilongwe, Blantyre & more.</p>
            </div>
            <div onClick={() => handleSelect(UserRole.SELLER)} className="p-8 bg-secondary rounded-[32px] border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer group text-center">
                <PlusCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold">I am a Landlord</h3>
                <p className="text-xs text-text-secondary mt-2">List your property and reach verified tenants instantly.</p>
            </div>
        </div>
    );
};

export const ListingDetailsScreen: React.FC = () => {
    const { selectedListing, setCurrentScreen, isAuthenticated } = useAppContext();
    const [bookingStep, setBookingStep] = useState<'details' | 'schedule'>('details');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
    const [loading, setLoading] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    if (!selectedListing) return null;

    const handleSchedule = async () => {
        if (!isAuthenticated) { setCurrentScreen(Screen.LOGIN); return; }
        if (!selectedDate) { alert('Please select a date'); return; }
        
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            await bookingService.createBooking({
                listing_id: selectedListing.id,
                tenant_id: user?.id || '',
                landlord_id: selectedListing.sellerId,
                viewing_date: selectedDate,
                time_slot: selectedSlot,
                listing_title: selectedListing.title,
                listing_image: selectedListing.imageUrl
            });
            setCurrentScreen(Screen.BOOKINGS);
        } catch (e) {
            alert('Failed to schedule viewing. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-full pb-32">
            <Header title={bookingStep === 'details' ? "Property Details" : "Schedule Viewing"} onBack={() => bookingStep === 'details' ? setCurrentScreen(Screen.HOME_SCREEN) : setBookingStep('details')} />
            
            {bookingStep === 'details' ? (
                <>
                    <div className="h-64 bg-secondary relative group overflow-hidden">
                        <img src={selectedListing.imageUrl} className="w-full h-full object-cover" alt={selectedListing.title} />
                        {(selectedListing as any).video_url && (
                            <button 
                                onClick={() => setShowVideo(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <div className="bg-white/90 backdrop-blur p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                    <NyumbaNowLogo className="w-8 h-8 text-primary" />
                                </div>
                            </button>
                        )}
                    </div>
                    
                    {showVideo && (selectedListing as any).video_url && (
                        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in duration-300">
                             <button onClick={() => setShowVideo(false)} className="absolute top-6 left-6 z-10 p-3 bg-white/20 rounded-full backdrop-blur-md text-white"><ChevronLeftIcon /></button>
                             <video 
                                src={(selectedListing as any).video_url} 
                                className="w-full h-full object-contain" 
                                autoPlay 
                                controls 
                             />
                        </div>
                    )}

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold flex-grow pr-4">{selectedListing.title}</h1>
                            <div className="text-primary text-xl font-bold shrink-0">MK {selectedListing.price.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center text-text-secondary text-sm mb-6">
                            <MapPinIcon className="w-4 h-4 mr-1.5 text-primary" /> {selectedListing.location}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-secondary/50 p-4 rounded-2xl border border-border-soft">
                                <BedIcon className="w-5 h-5 text-primary mb-1" />
                                <div className="font-bold">{selectedListing.bedrooms || 0} Rooms</div>
                            </div>
                            <div className="bg-secondary/50 p-4 rounded-2xl border border-border-soft">
                                <BathIcon className="w-5 h-5 text-primary mb-1" />
                                <div className="font-bold">{selectedListing.bathrooms || 0} Baths</div>
                            </div>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-8">{selectedListing.description}</p>
                        
                        {(selectedListing as any).video_url && (
                            <button onClick={() => setShowVideo(true)} className="w-full p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold text-sm uppercase mb-8">
                                <SunIcon className="w-5 h-5" /> WATCH AI VIDEO TOUR
                            </button>
                        )}
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border-soft flex gap-3 z-20">
                        <Button onClick={() => setBookingStep('schedule')} className="shadow-xl">SCHEDULE VIEWING TOUR</Button>
                    </div>
                </>
            ) : (
                <div className="p-8 space-y-8 animate-in slide-in-from-right-10 duration-300">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Select Viewing Date</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-secondary p-5 rounded-[24px] outline-none font-bold text-lg border-2 border-transparent focus:border-primary transition-all" />
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">Select Time Slot</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Morning', 'Afternoon', 'Evening'].map(slot => (
                                <button key={slot} onClick={() => setSelectedSlot(slot as any)} className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedSlot === slot ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border-soft'}`}>{slot}</button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleSchedule} disabled={loading}>
                        {loading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'CONFIRM VIEWING REQUEST'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export const FavoritesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Saved Listings" />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <HeartIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No saved homes yet</h3>
            <p className="text-sm text-text-secondary">Tap the heart on any property to save it.</p>
        </div>
    </div>
);

export const MessagesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Messages" />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-[40px] border border-border-soft shadow-sm">
            <MessageSquareIcon className="w-16 h-16 text-gray-100 mb-6" />
            <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
        </div>
    </div>
);

export const ProfileScreen: React.FC = () => {
    const { setCurrentScreen, setIsAuthenticated, userRole } = useAppContext();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        profileService.getMyProfile().then(p => { setProfile(p); setLoading(false); });
    }, []);

    return (
        <div className="h-full flex flex-col bg-secondary">
            <div className="bg-white p-8 pt-16 rounded-b-[48px] shadow-sm flex flex-col items-center text-center border-b border-border-soft">
                <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center mb-6 border-4 border-white shadow-xl overflow-hidden">
                    {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-300" />}
                </div>
                <h3 className="text-2xl font-bold mb-1 capitalize">{loading ? 'Loading...' : (profile?.full_name || 'Nyumba User')}</h3>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">{userRole} Account</div>
            </div>

            <div className="p-6 space-y-4">
                <button onClick={() => setCurrentScreen(Screen.EDIT_PROFILE)} className="w-full flex items-center justify-between p-6 bg-white rounded-[32px] border border-border-soft">
                    <div className="flex items-center gap-4"><UserIcon className="w-5 h-5 text-primary" /><span className="font-bold text-sm">Personal Details</span></div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                </button>
                <button onClick={() => setCurrentScreen(Screen.BOOKINGS)} className="w-full flex items-center justify-between p-6 bg-white rounded-[32px] border border-border-soft">
                    <div className="flex items-center gap-4"><CalendarIcon className="w-5 h-5 text-primary" /><span className="font-bold text-sm">Viewing Tours</span></div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                </button>
                <button onClick={() => setCurrentScreen(Screen.SETTINGS)} className="w-full flex items-center justify-between p-6 bg-white rounded-[32px] border border-border-soft">
                    <div className="flex items-center gap-4"><SettingsIcon className="w-5 h-5 text-primary" /><span className="font-bold text-sm">Settings</span></div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                </button>
                <button onClick={async () => { await authService.signOut(); setIsAuthenticated(false); setCurrentScreen(Screen.LOGIN); }} className="w-full p-6 bg-red-50 text-red-500 rounded-[32px] font-bold active:scale-95 transition-all flex items-center justify-center gap-2">
                    <LogOutIcon className="w-5 h-5" /> SIGN OUT
                </button>
            </div>
        </div>
    );
};

export const DashboardScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [stats, setStats] = useState({ listings: 0, bookings: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const listings = await listingService.getBySeller(user.id);
            const bookings = await bookingService.getMyBookings('landlord');
            setStats({ listings: listings.length, bookings: bookings.filter(b => b.status === 'Pending').length });
        };
        fetchStats();
    }, []);

    return (
        <div className="h-full flex flex-col bg-secondary pb-20">
            <div className="p-8 pt-16 bg-white rounded-b-[48px] shadow-sm border-b border-border-soft">
                 <h1 className="text-4xl font-bold mb-1 font-heading tracking-tight">Seller Hub</h1>
                 <p className="text-text-secondary text-sm font-medium">Manage your properties in Malawi.</p>
             </div>
            <div className="p-6 space-y-6">
                <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                    <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Active Listings</div>
                    <div className="text-5xl font-bold mb-6">{stats.listings}</div>
                    <button onClick={() => setCurrentScreen(Screen.ADD_LISTING)} className="w-full bg-white text-primary py-4 rounded-2xl font-bold text-sm uppercase flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <PlusCircleIcon className="w-5 h-5" /> ADD NEW UNIT
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setCurrentScreen(Screen.BOOKINGS)} className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft text-left active:scale-95 transition-transform">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">New Tours</div>
                        <div className="text-3xl font-bold text-primary">{stats.bookings}</div>
                    </button>
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-border-soft">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Total Leads</div>
                        <div className="text-3xl font-bold">0</div>
                    </div>
                </div>

                <button onClick={() => setCurrentScreen(Screen.MANAGE_LISTINGS)} className="w-full bg-white p-6 rounded-[32px] shadow-sm border border-border-soft flex items-center justify-between font-bold group">
                    <div className="flex items-center gap-3"><div className="p-2 bg-secondary rounded-xl"><ListIcon className="w-5 h-5" /></div> Manage My Listings</div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                </button>
            </div>
        </div>
    );
};

export const AddListingScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', price: '', location: 'Lilongwe', description: '', bedrooms: '2', bathrooms: '1' });
    
    const handleGenerateVideo = async () => {
        if (!formData.description) { alert('Please enter a description first.'); return; }
        setVideoLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            let operation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: `A cinematic 4K walkthrough of a house in Malawi: ${formData.description}. Sunny day, realistic architecture.`,
              config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
              }
            });
            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              operation = await ai.operations.getVideosOperation({operation: operation});
            }
            const link = operation.response?.generatedVideos?.[0]?.video?.uri;
            setVideoUrl(`${link}&key=${process.env.API_KEY}`);
        } catch (e) {
            alert('Video generation failed. Try shorter prompt.');
        } finally {
            setVideoLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.price) return;
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            await supabase.from('listings').insert([{
                title: formData.title,
                price: Number(formData.price),
                location: formData.location,
                description: formData.description,
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop',
                video_url: videoUrl,
                seller_id: user?.id,
                seller_name: user?.user_metadata?.full_name || 'Landlord'
            }]);
            setCurrentScreen(Screen.DASHBOARD);
        } catch (e) {
            alert('Failed to publish.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <Header title="Add New House" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
            <div className="flex-grow overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
                <div className="space-y-4">
                    <div className="w-full aspect-video bg-secondary rounded-[32px] flex flex-col items-center justify-center border-4 border-dashed border-border-soft relative overflow-hidden">
                        {videoUrl ? (
                            <video src={videoUrl} className="w-full h-full object-cover" autoPlay muted loop />
                        ) : (
                            <>
                                <CameraIcon className="w-12 h-12 text-gray-300 mb-3" />
                                <span className="text-xs font-bold text-text-secondary uppercase">Main Photo</span>
                            </>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleGenerateVideo}
                        disabled={videoLoading}
                        className="w-full py-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                    >
                        {videoLoading ? <LoaderIcon className="animate-spin" /> : <SunIcon className="w-4 h-4" />}
                        {videoLoading ? 'RENDERING 1080P TOUR...' : 'GENERATE AI VIRTUAL TOUR'}
                    </button>
                </div>
                
                <div className="space-y-6">
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary font-bold text-xl" placeholder="E.g. 3 Bedroom House in Area 10" />
                    <div className="grid grid-cols-2 gap-6">
                        <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary font-bold text-xl" type="number" placeholder="Rent (MK)" />
                        <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border-b-2 border-border-soft py-4 outline-none focus:border-primary font-bold text-lg bg-transparent">
                            <option>Lilongwe</option><option>Blantyre</option><option>Mzuzu</option><option>Zomba</option>
                        </select>
                    </div>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-secondary p-5 rounded-[24px] outline-none font-medium text-sm h-40 resize-none" placeholder="Details about the property... (AI uses this for video)"></textarea>
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-border-soft z-10 max-w-sm mx-auto">
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? <LoaderIcon className="animate-spin mx-auto w-6 h-6" /> : 'PUBLISH LISTING'}</Button>
                </div>
            </div>
        </div>
    );
};

export const ManageListingsScreen: React.FC = () => {
    const { setCurrentScreen } = useAppContext();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await listingService.getBySeller(user.id);
                setListings(data);
            }
            setLoading(false);
        };
        fetchMyListings();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await listingService.deleteListing(id);
        setListings(listings.filter(l => l.id !== id));
    };

    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header title="My Portfolio" onBack={() => setCurrentScreen(Screen.DASHBOARD)} />
            <div className="p-4 space-y-4 overflow-y-auto flex-grow scrollbar-hide">
                {loading ? <ListingSkeleton /> : listings.length > 0 ? (
                    listings.map(l => (
                        <div key={l.id} className="bg-white p-4 rounded-[28px] border border-border-soft shadow-sm flex items-center gap-4">
                            <img src={l.imageUrl} className="w-16 h-16 rounded-2xl object-cover" />
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-sm truncate">{l.title}</h4>
                                <p className="text-[10px] text-text-secondary font-bold uppercase">{l.location}</p>
                            </div>
                            <button onClick={() => handleDelete(l.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl active:scale-90 transition-transform"><LogOutIcon className="w-4 h-4" /></button>
                        </div>
                    ))
                ) : <div className="text-center py-20 bg-white m-4 rounded-[40px] p-8">No active listings.</div>}
            </div>
        </div>
    );
};

export const NotificationsScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-secondary">
        <Header title="Alerts" onBack={() => Screen.HOME_SCREEN} />
        <div className="p-4 space-y-4">
            <div className="p-6 bg-white rounded-[32px] border border-border-soft shadow-sm">
                <h4 className="font-bold text-sm">Welcome to NyumbaNow!</h4>
                <p className="text-xs text-text-secondary">Start exploring verified rentals across Malawi today.</p>
            </div>
        </div>
    </div>
);

export const RulesAndPoliciesScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white">
        <Header title="Safety Guide" />
        <div className="p-8 space-y-8">
            <h3 className="font-bold text-2xl font-heading">Stay Safe while Renting</h3>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">1. Physical Viewings: Always visit houses during the day.<br/>2. Direct Payments: Only pay rent after signing a formal lease agreement.</p>
        </div>
    </div>
);

export const SettingsScreen: React.FC = () => {
    const { dataSaverMode, setDataSaverMode, setCurrentScreen } = useAppContext();
    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header title="Preferences" onBack={() => setCurrentScreen(Screen.PROFILE)} />
            <div className="p-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm flex justify-between items-center">
                    <div><span className="font-bold">Data Saver Mode</span></div>
                    <button onClick={() => setDataSaverMode(!dataSaverMode)} className={`w-14 h-7 rounded-full relative p-1 transition-all ${dataSaverMode ? 'bg-primary' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute transition-all ${dataSaverMode ? 'right-1' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AboutScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white items-center justify-center p-12 text-center">
        <NyumbaNowLogo className="w-24 h-24 text-primary mb-8" />
        <h2 className="text-3xl font-bold font-heading mb-4">NyumbaNow Malawi</h2>
        <p className="text-text-secondary font-medium">Connecting Malawi to safe homes.</p>
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
                <input value={name} onChange={e => setName(e.target.value)} className="w-full border-b-2 border-border-soft py-4 outline-none font-bold text-xl" placeholder="Full Name" />
                <Button onClick={handleSave} disabled={loading}>{loading ? <LoaderIcon className="animate-spin" /> : 'SAVE CHANGES'}</Button>
            </div>
        </div>
    );
};

export const BookingsScreen: React.FC = () => {
    const { userRole } = useAppContext();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const data = await bookingService.getMyBookings(userRole === UserRole.BUYER ? 'tenant' : 'landlord');
            setBookings(data);
            setLoading(false);
        };
        fetchBookings();
    }, [userRole]);

    const getStatusColor = (status: Booking['status']) => {
        if (status === 'Confirmed') return 'text-emerald-500 bg-emerald-50';
        if (status === 'Cancelled') return 'text-red-500 bg-red-50';
        return 'text-amber-500 bg-amber-50';
    };

    return (
        <div className="h-full flex flex-col bg-secondary">
            <Header title="Viewing Tours" />
            <div className="p-4 space-y-4 overflow-y-auto flex-grow scrollbar-hide">
                {loading ? <div className="text-center py-20">Loading...</div> : bookings.length > 0 ? (
                    bookings.map(b => (
                        <div key={b.id} className="bg-white p-5 rounded-[32px] border border-border-soft shadow-sm">
                            <div className="flex gap-4 mb-4">
                                <img src={b.listing_image} className="w-16 h-16 rounded-2xl object-cover" />
                                <div className="flex-grow">
                                    <h4 className="font-bold text-sm leading-tight mb-1">{b.listing_title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${getStatusColor(b.status)}`}>{b.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border-soft text-[10px] font-bold text-text-secondary uppercase">
                                <div className="flex items-center gap-2"><CalendarIcon className="w-3 h-3" /> {new Date(b.viewing_date).toLocaleDateString()}</div>
                                <div className="flex items-center gap-2"><ClockIcon className="w-3 h-3" /> {b.time_slot}</div>
                            </div>
                        </div>
                    ))
                ) : <div className="text-center py-20 bg-white m-4 rounded-[40px] p-8 font-bold">No tours found.</div>}
            </div>
        </div>
    );
};

export const BoostListingScreen: React.FC = () => (
    <div className="h-full flex flex-col bg-white">
        <Header title="Get Featured" />
        <div className="p-8 flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[32px] flex items-center justify-center animate-pulse"><SunIcon className="w-10 h-10" /></div>
            <h2 className="text-3xl font-bold font-heading">NyumbaBoost</h2>
            <div className="w-full p-6 bg-amber-50 rounded-[32px] border-2 border-amber-200 border-dashed text-amber-800 font-bold text-lg">MK 5,000 / Week</div>
            <Button onClick={() => {}}>BOOST NOW</Button>
        </div>
    </div>
);
