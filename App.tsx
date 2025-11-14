

import React, { useState, createContext, useContext } from 'react';
import { Screen, UserRole, Listing, AppContextType } from './types';
import { 
  SplashScreen, LoginScreen, RoleSelectionScreen, HomeScreen, ListingDetailsScreen,
  FavoritesScreen, MessagesScreen, ProfileScreen, DashboardScreen, AddListingScreen,
  ManageListingsScreen, NotificationsScreen, RulesAndPoliciesScreen, SettingsScreen, 
  AboutScreen, EditProfileScreen
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [postLoginRedirect, setPostLoginRedirect] = useState<Screen | null>(null);
  const [listingToEdit, setListingToEdit] = useState<Listing | null>(null);


  const contextValue: AppContextType = {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    selectedListing,
    setSelectedListing,
    isAuthenticated,
    setIsAuthenticated,
    postLoginRedirect,
    setPostLoginRedirect,
    listingToEdit,
    setListingToEdit,
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
      default:
        return <HomeScreen />;
    }
  };

  const showNavBar = () => {
    if (!isAuthenticated) return false;

    const buyerScreens = [Screen.HOME_SCREEN, Screen.FAVORITES, Screen.MESSAGES, Screen.PROFILE];
    const sellerScreens = [Screen.DASHBOARD, Screen.MANAGE_LISTINGS, Screen.MESSAGES, Screen.PROFILE];

    if (userRole === UserRole.BUYER && buyerScreens.includes(currentScreen)) return true;
    if (userRole === UserRole.SELLER && sellerScreens.includes(currentScreen)) return true;
    
    return false;
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