import 'react-native-gesture-handler'; // MUST be at the very top
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Context Provider
import { AppProvider } from './context/AppContext';

// Screens
import LandingScreen from './screens/LandingScreen';
import FarmerInfoScreen from './screens/FarmerInfoScreen';
import FarmInfoScreen from './screens/FarmInfoScreen';
import ProgramSelectionScreen from './screens/ProgramSelectionScreen';
import DocumentationScreen from './screens/DocumentationScreen';
import DashboardScreen from './screens/DashboardScreen';
import VouchersScreen from './screens/VouchersScreen';
import OrdersScreen from './screens/OrdersScreen';
import SuppliersScreen from './screens/SuppliersScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#4CAF50', // Farm green
  secondary: '#81C784',
  background: '#F8F9FA',
  white: '#FFFFFF',
  text: '#2E2E2E',
  textLight: '#757575',
  border: '#E0E0E0'
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Vouchers':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Orders':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Suppliers':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          height: 60
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          shadowColor: 'transparent',
          elevation: 0
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: COLORS.text
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Vouchers" component={VouchersScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Suppliers" component={SuppliersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const [isRegistered, setIsRegistered] = useState(null);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('farmerToken');
      setIsRegistered(!!token);
    } catch (error) {
      console.log('Error checking registration:', error);
      setIsRegistered(false);
    }
  };

  if (isRegistered === null) {
    return null; // Loading state
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isRegistered ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="FarmerInfo" component={FarmerInfoScreen} />
            <Stack.Screen name="FarmInfo" component={FarmInfoScreen} />
            <Stack.Screen name="ProgramSelection" component={ProgramSelectionScreen} />
            <Stack.Screen name="Documentation" component={DocumentationScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
