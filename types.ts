
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
  AI_SEARCH,
}

// Added missing Notification interface to fix error in constants.tsx
export interface Notification {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

// Added missing Review interface to fix error in components/ui.tsx and constants.tsx
export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  timestamp: string;
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

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  text: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  landlord_id: string;
  listing_id: number;
  last_message?: string;
  updated_at: string;
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
  amenities?: string[];
  isVerified?: boolean;
  is_promoted?: boolean;
}

export enum ListingCategory {
  HOUSE_RENTAL = 'House Rentals',
  BEDROOM_RENTAL = 'Bedroom Rentals',
}

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  dataSaverMode: boolean;
  setDataSaverMode: (mode: boolean) => void;
}
