// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  darkGray: '#48484A',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  text: '#1C1C1E',
  secondaryText: '#8E8E93',
  border: '#C6C6C8',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Dimensions
export const DIMENSIONS = {
  borderRadius: 8,
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 60,
  tabBarHeight: 80,
};

// Audio playback speeds
export const PLAYBACK_SPEEDS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.33x', value: 0.33 },
  { label: '0.75x', value: 0.75 },
  { label: '1.0x', value: 1.0 },
];

// Gender options
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

// API endpoints
export const API_ENDPOINTS = {
  USERS: '/users',
  LOGIN: '/auth/login',
  UPDATE_PROFILE: '/users/update',
  STUDY_RECORD: '/study-record',
};

// Screen names
export const SCREEN_NAMES = {
  // Auth screens
  AUTH_STACK: 'AuthStack',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  
  // Main tab screens
  MAIN_TABS: 'MainTabs',
  DRUGS_TAB: 'DrugsTab',
  LEARNING_TAB: 'LearningTab',
  COMMUNITY_TAB: 'CommunityTab',
  PROFILE_TAB: 'ProfileTab',
  
  // Drug screens
  DRUG_CATEGORIES: 'DrugCategories',
  DRUG_LIST: 'DrugList',
  DRUG_DETAIL: 'DrugDetail',
  
  // Learning screens
  LEARNING_LIST: 'LearningList',
  LEARNING_SCREEN: 'LearningScreen',
  
  // Other screens
  COMMUNITY: 'Community',
  PROFILE: 'Profile',
  SPLASH: 'Splash',
};

// Tab icons
export const TAB_ICONS = {
  drugs: 'medical',
  learning: 'school',
  community: 'people',
  profile: 'person',
};

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  PLAYBACK_SPEEDS,
  GENDER_OPTIONS,
  API_ENDPOINTS,
  SCREEN_NAMES,
  TAB_ICONS,
}; 