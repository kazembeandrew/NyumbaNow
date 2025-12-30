
import React, { useState, createContext, useContext, useEffect } from 'react';
import { Screen, UserRole, Listing, AppContextType, ChatPartner } from './types';
import { 
  SplashScreen, LoginScreen, RoleSelectionScreen, HomeScreen, ListingDetailsScreen,
  FavoritesScreen, MessagesScreen, ChatRoomScreen, ProfileScreen, DashboardScreen, AddListingScreen,
  ManageListingsScreen, NotificationsScreen, RulesAndPoliciesScreen, SettingsScreen, 
  AboutScreen, EditProfileScreen, BookingsScreen, BoostListingScreen
} from './components/screens';
import { BottomNavBar } from './components/ui';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeChatPartner, setActiveChatPartner] = useState<ChatPartner | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [postLoginRedirect, setPostLoginRedirect] = useState<Screen | null>(null);
  const [listingToEdit, setListingToEdit] = useState<Listing | null>(null);
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(() => {
    return localStorage.getItem('nyumbanow_datasaver') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('nyumbanow_datasaver', dataSaverMode.toString());
  }, [dataSaverMode]);

  const contextValue: AppContextType = {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    selectedListing,
    setSelectedListing,
    activeChatPartner,
    setActiveChatPartner,
    isAuthenticated,
    setIsAuthenticated,
    postLoginRedirect,
    setPostLoginRedirect,
    listingToEdit,
    setListingToEdit,
    dataSaverMode,
    setDataSaverMode
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH:
        return <SplashScreen />;
      case Screen.LOGIN:
        return <LoginScreen />;
      case Screen.ROLE_SELECTION:
        return <RoleSelectionScreen />;
      case Screen.HOME_SCREEN:
        return <HomeScreen />;
      case Screen.LISTING_DETAILS:
        return <ListingDetailsScreen />;
      case Screen.FAVORITES:
        return <FavoritesScreen />;
      case Screen.MESSAGES:
        return <MessagesScreen />;
      case Screen.CHAT_ROOM:
        return <ChatRoomScreen />;
      case Screen.PROFILE:
        return <ProfileScreen />;
      case Screen.DASHBOARD:
          return <DashboardScreen />;
      case Screen.ADD_LISTING:
          return <AddListingScreen />;
      case Screen.MANAGE_LISTINGS:
          return <ManageListingsScreen />;
      case Screen.NOTIFICATIONS:
          return <NotificationsScreen />;
      case Screen.RULES_AND_POLICIES:
          return <RulesAndPoliciesScreen />;
      case Screen.SETTINGS:
          return <SettingsScreen />;
      case Screen.EDIT_PROFILE:
          return <EditProfileScreen />;
      case Screen.ABOUT:
          return <AboutScreen />;
      case Screen.BOOKINGS:
          return <BookingsScreen />;
      case Screen.BOOST_LISTING:
          return <BoostListingScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showNavBar = () => {
    // Hide nav bar on specific screens
    const hideOn = [Screen.SPLASH, Screen.LOGIN, Screen.ROLE_SELECTION, Screen.CHAT_ROOM, Screen.LISTING_DETAILS, Screen.ADD_LISTING, Screen.BOOST_LISTING];
    if (hideOn.includes(currentScreen)) return false;
    if (!isAuthenticated) return false;
    return true;
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
