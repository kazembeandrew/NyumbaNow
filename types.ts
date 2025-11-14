

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
  PROFILE,
  DASHBOARD,
  ADD_LISTING,
  MANAGE_LISTINGS,
  NOTIFICATIONS,
  RULES_AND_POLICIES,
  SETTINGS,
  EDIT_PROFILE,
  ABOUT,
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
  priceType: 'per month' | 'per day' | 'one-time';
  location: string;
  imageUrl: string;
  description: string;
  images: string[];
  status: 'Available' | 'Rented' | 'Pending' | 'Under Maintenance' | 'Sold';
  sellerId: number;
  sellerName: string;
  category: ListingCategory;
  bedrooms?: number;
  bathrooms?: number;
  phoneNumber?: string;
  email?: string;
  reviews?: Review[];
}

export interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  avatarUrl: string;
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
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  postLoginRedirect: Screen | null;
  setPostLoginRedirect: (screen: Screen | null) => void;
  listingToEdit: Listing | null;
  setListingToEdit: (listing: Listing | null) => void;
}