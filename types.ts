
export enum UserRole {
  BUYER = 'Buyer',
  SELLER = 'Seller',
  NONE = 'None',
}

export enum Screen {
  SPLASH,
  LOGIN,
  ROLE_SELECTION,
  HOME_SCREEN,
  LISTING_DETAILS,
  FAVORITES,
  MESSAGES,
  CHAT_ROOM,
  PROFILE,
  DASHBOARD,
  ADD_LISTING,
  MANAGE_LISTINGS,
  NOTIFICATIONS,
  RULES_AND_POLICIES,
  SETTINGS,
  EDIT_PROFILE,
  ABOUT,
  BOOKINGS,
  BOOST_LISTING,
}

export interface Booking {
  id: string;
  listing_id: number;
  tenant_id: string;
  landlord_id: string;
  viewing_date: string;
  time_slot: 'Morning' | 'Afternoon' | 'Evening';
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  listing_title: string;
  listing_image: string;
}

export interface Landlord {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  authorName: string;
  authorImageUrl?: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export enum ListingCategory {
  HOUSE_RENTAL = 'House Rentals',
  BEDROOM_RENTAL = 'Bedroom Rentals',
  EVENT_VENUE_HIRE = 'Event Venues',
  CAR_HIRE = 'Car Hire',
  EQUIPMENT_HIRE = 'Equipment Hire',
  LAND_SALE = 'Land for Sale',
  HOUSE_SALE = 'Houses for Sale',
  CAR_SALE = 'Cars for Sale',
  ELECTRONICS_SALE = 'Electronics for Sale',
}

export interface Listing {
  id: number;
  title: string;
  price: number;
  priceType: 'per month' | 'per day' | 'one-time' | 'rent';
  location: string;
  imageUrl: string;
  description: string;
  images: string[];
  status: 'Available' | 'Rented' | 'Pending' | 'Under Maintenance' | 'Sold';
  sellerId: string;
  sellerName: string;
  category: ListingCategory;
  bedrooms?: number;
  bathrooms?: number;
  phoneNumber?: string;
  email?: string;
  reviews?: Review[];
  amenities?: string[];
  isVerified?: boolean;
  is_promoted?: boolean;
}

export interface Message {
  id: string | number;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
}

export interface ChatPartner {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  partner_name: string;
  last_message: string;
  partner_id: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  activeChatPartner: ChatPartner | null;
  setActiveChatPartner: (partner: ChatPartner | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  postLoginRedirect: Screen | null;
  setPostLoginRedirect: (screen: Screen | null) => void;
  listingToEdit: Listing | null;
  setListingToEdit: (listing: Listing | null) => void;
  dataSaverMode: boolean;
  setDataSaverMode: (mode: boolean) => void;
}
