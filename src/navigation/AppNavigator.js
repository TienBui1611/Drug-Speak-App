import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { selectCurrentLearningCount } from '../store/learningSlice';
import { selectIsAuthenticated } from '../store/authSlice';

// Drug Screens
import DrugCategoriesScreen from '../screens/drugs/DrugCategoriesScreen';
import DrugListScreen from '../screens/drugs/DrugListScreen';
import DrugDetailScreen from '../screens/drugs/DrugDetailScreen';

// Learning Screens
import LearningListScreen from '../screens/learning/LearningListScreen';
import LearningScreen from '../screens/learning/LearningScreen';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Other Screens
import ProfileScreen from '../screens/ProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';

const Tab = createBottomTabNavigator();
const DrugStack = createStackNavigator();
const LearningStack = createStackNavigator();
const AuthStack = createStackNavigator();

// Drug Stack Navigator
const DrugStackNavigator = () => {
  return (
    <DrugStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <DrugStack.Screen 
        name="DrugCategories" 
        component={DrugCategoriesScreen}
        options={{ title: 'Drug Categories' }}
      />
      <DrugStack.Screen 
        name="DrugList" 
        component={DrugListScreen}
        options={({ route }) => ({ 
          title: route.params?.categoryName || 'Drugs' 
        })}
      />
      <DrugStack.Screen 
        name="DrugDetail" 
        component={DrugDetailScreen}
        options={({ route }) => ({ 
          title: route.params?.drugName || 'Drug Details' 
        })}
      />
    </DrugStack.Navigator>
  );
};

// Learning Stack Navigator
const LearningStackNavigator = () => {
  return (
    <LearningStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <LearningStack.Screen 
        name="LearningList" 
        component={LearningListScreen}
        options={{ title: 'My Learning' }}
      />
      <LearningStack.Screen 
        name="LearningScreen" 
        component={LearningScreen}
        options={({ route }) => ({ 
          title: route.params?.drugName || 'Learning' 
        })}
      />
    </LearningStack.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator (Protected - requires authentication)
const MainTabNavigator = () => {
  const currentLearningCount = useSelector(selectCurrentLearningCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Drugs') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Learning') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Drugs" 
        component={DrugStackNavigator}
        options={{ title: 'Drugs' }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningStackNavigator}
        options={{
          title: 'Learning',
          tabBarBadge: currentLearningCount > 0 ? currentLearningCount : null,
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ 
          title: 'Community',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
};

// Root App Navigator
const AppNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />;
};

export default AppNavigator; 