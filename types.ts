
export enum UserRole {
  TENANT = 'Tenant',
  LANDLORD = 'Landlord',
  AGENT = 'Agent',
  NONE = 'None',
}

export enum Screen {
  SPLASH,
  LOGIN,
  ROLE_SELECTION,
  TENANT_HOME,
  PROPERTY_DETAILS,
  FAVORITES,
  MESSAGES,
  TENANT_PROFILE,
  LANDLORD_DASHBOARD,
  ADD_PROPERTY,
  MANAGE_PROPERTIES,
  AGENT_DASHBOARD,
  AGENT_PROFILE,
  AGENT_PROPERTY_MANAGEMENT,
  NOTIFICATIONS,
  RULES_AND_POLICIES,
  SETTINGS,
  ABOUT,
}

export interface Landlord {
  id: number;
  name: string;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  description: string;
  images: string[];
  status: 'Available' | 'Rented' | 'Pending' | 'Under Maintenance';
  landlordId: number;
  landlordName: string;
  phoneNumber?: string;
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
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}