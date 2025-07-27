import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { store } from './src/store/store';
import { initializeAuth, getAuthToken } from './src/services/api';
import { setUser, selectIsAuthenticated } from './src/store/authSlice';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

// Disable all error overlays and warnings in the app
LogBox.ignoreAllLogs(true);

// Alternative: Ignore specific warnings only
// LogBox.ignoreLogs([
//   'Warning: Text strings must be rendered within a <Text> component',
//   'expo-av has been deprecated',
//   'API Error:',
// ]);

// App content component that uses Redux
const AppContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auth token in API service
        await initializeAuth();
        
        // Check if user has a stored token
        const token = await getAuthToken();
        if (token) {
          // TODO: Validate token with backend and get user data
          // For now, we'll let the auth state determine the flow
          // In a production app, you'd want to verify the token is still valid
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <AppNavigator />;
};

// Main App component
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
