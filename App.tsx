
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Screen, UserRole, Listing, AppContextType } from './types';
import { 
  SplashScreen, LoginScreen, RoleSelectionScreen, HomeScreen, ListingDetailsScreen,
  FavoritesScreen, MessagesScreen, ChatRoomScreen, ProfileScreen, DashboardScreen, AddListingScreen,
  ManageListingsScreen, NotificationsScreen, RulesAndPoliciesScreen, SettingsScreen, 
  AboutScreen, EditProfileScreen, BookingsScreen, BoostListingScreen, AISearchScreen
} from './components/screens';
import { BottomNavBar } from './components/ui';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext error');
  return context;
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(() => localStorage.getItem('nyumbanow_datasaver') === 'true');

  useEffect(() => {
    localStorage.setItem('nyumbanow_datasaver', dataSaverMode.toString());
  }, [dataSaverMode]);

  const contextValue: AppContextType = {
    currentScreen, setCurrentScreen,
    userRole, setUserRole,
    selectedListing, setSelectedListing,
    isAuthenticated, setIsAuthenticated,
    dataSaverMode, setDataSaverMode
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH: return <SplashScreen />;
      case Screen.LOGIN: return <LoginScreen />;
      case Screen.ROLE_SELECTION: return <RoleSelectionScreen />;
      case Screen.HOME_SCREEN: return <HomeScreen />;
      case Screen.AI_SEARCH: return <AISearchScreen />;
      case Screen.LISTING_DETAILS: return <ListingDetailsScreen />;
      case Screen.CHAT_ROOM: return <ChatRoomScreen />;
      case Screen.PROFILE: return <ProfileScreen />;
      case Screen.DASHBOARD: return <DashboardScreen />;
      case Screen.ADD_LISTING: return <AddListingScreen />;
      case Screen.MANAGE_LISTINGS: return <ManageListingsScreen />;
      case Screen.NOTIFICATIONS: return <NotificationsScreen />;
      case Screen.BOOKINGS: return <BookingsScreen />;
      default: return <HomeScreen />;
    }
  };

  const showNavBar = () => {
    const hideOn = [Screen.SPLASH, Screen.LOGIN, Screen.ROLE_SELECTION, Screen.CHAT_ROOM, Screen.AI_SEARCH];
    return !hideOn.includes(currentScreen) && isAuthenticated;
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="bg-gray-200 flex justify-center items-center h-screen font-sans">
        <div className="w-full max-w-sm h-full bg-secondary shadow-lg overflow-hidden flex flex-col relative md:max-h-[844px] md:rounded-lg">
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            {renderScreen()}
          </div>
          {showNavBar() && <BottomNavBar />}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
