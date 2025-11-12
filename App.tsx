
import React, { useState, createContext, useContext } from 'react';
import { Screen, UserRole, Property, AppContextType } from './types';
import { 
  SplashScreen, LoginScreen, RoleSelectionScreen, TenantHomeScreen, PropertyDetailsScreen,
  FavoritesScreen, MessagesScreen, TenantProfileScreen, LandlordDashboardScreen, AddPropertyScreen,
  ManagePropertiesScreen, AgentDashboardScreen, AgentProfileScreen, AgentPropertyManagementScreen,
  NotificationsScreen, RulesAndPoliciesScreen, SettingsScreen, AboutScreen
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
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.TENANT_HOME);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  const contextValue: AppContextType = {
    currentScreen,
    setCurrentScreen,
    userRole,
    setUserRole,
    selectedProperty,
    setSelectedProperty,
    isAuthenticated,
    setIsAuthenticated,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen />;
      case Screen.ROLE_SELECTION:
        return <RoleSelectionScreen />;
      case Screen.TENANT_HOME:
        return <TenantHomeScreen />;
      case Screen.PROPERTY_DETAILS:
        return <PropertyDetailsScreen />;
      case Screen.FAVORITES:
        return <FavoritesScreen />;
      case Screen.MESSAGES:
        return <MessagesScreen />;
      case Screen.TENANT_PROFILE:
        return <TenantProfileScreen />;
      case Screen.LANDLORD_DASHBOARD:
          return <LandlordDashboardScreen />;
      case Screen.ADD_PROPERTY:
          return <AddPropertyScreen />;
      case Screen.MANAGE_PROPERTIES:
          return <ManagePropertiesScreen />;
      case Screen.AGENT_DASHBOARD:
          return <AgentDashboardScreen />;
      case Screen.AGENT_PROFILE:
          return <AgentProfileScreen />;
      case Screen.AGENT_PROPERTY_MANAGEMENT:
          return <AgentPropertyManagementScreen />;
      case Screen.NOTIFICATIONS:
          return <NotificationsScreen />;
      case Screen.RULES_AND_POLICIES:
          return <RulesAndPoliciesScreen />;
      case Screen.SETTINGS:
          return <SettingsScreen />;
      case Screen.ABOUT:
          return <AboutScreen />;
      default:
        return <TenantHomeScreen />;
    }
  };

  const showNavBar = () => {
    if (!isAuthenticated) return false;

    const tenantScreens = [Screen.TENANT_HOME, Screen.FAVORITES, Screen.MESSAGES, Screen.TENANT_PROFILE];
    const landlordScreens = [Screen.LANDLORD_DASHBOARD, Screen.MANAGE_PROPERTIES, Screen.MESSAGES];
    const agentScreens = [Screen.AGENT_DASHBOARD, Screen.AGENT_PROPERTY_MANAGEMENT, Screen.AGENT_PROFILE];

    if (userRole === UserRole.TENANT && tenantScreens.includes(currentScreen)) return true;
    if (userRole === UserRole.LANDLORD && landlordScreens.includes(currentScreen)) return true;
    if (userRole === UserRole.AGENT && agentScreens.includes(currentScreen)) return true;
    
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
