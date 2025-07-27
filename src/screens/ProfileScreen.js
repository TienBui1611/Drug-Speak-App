import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { 
  updateProfile, 
  signOut, 
  clearError, 
  selectUser, 
  selectAuthLoading, 
  selectAuthError 
} from '../store/authSlice';
import { 
  selectUserRecord, 
  selectUserRank,
  fetchUserStudyRecord 
} from '../store/studyRecordsSlice';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../constants';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userRecord = useSelector(selectUserRecord);
  const userRank = useSelector(selectUserRank);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    confirmPassword: '',
    gender: user?.gender || 'male',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id && !userRecord) {
      console.log('Fetching user study record for user ID:', user.id);
      dispatch(fetchUserStudyRecord(user.id));
    }
  }, [user, userRecord, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Profile Update Failed', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        gender: user.gender,
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password.trim() && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (validateForm()) {
      const updateData = {
        username: formData.username.trim(),
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      try {
        await dispatch(updateProfile(updateData)).unwrap();
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        // Error is handled by useEffect above
      }
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => dispatch(signOut())
        },
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      password: '',
      confirmPassword: '',
      gender: user?.gender || 'male',
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Ionicons 
                  name={user?.gender === 'male' ? 'man' : 'woman'} 
                  size={60} 
                  color={user?.gender === 'male' ? COLORS.primary : COLORS.secondary} 
                />
              </View>
              <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
              <Text style={styles.emailText}>{user?.email}</Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{String(userRecord?.currentLearning || 0)}</Text>
                  <Text style={styles.statLabel}>Currently Learning</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{String(userRecord?.finishedLearning || 0)}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{String(userRecord?.totalScore || 0)}</Text>
                  <Text style={styles.statLabel}>Total Score</Text>
                </View>
              </View>
              {userRank && (
                <View style={styles.rankContainer}>
                  <Ionicons name="trophy" size={20} color={COLORS.warning} />
                  <Text style={styles.rankText}>Rank #{userRank || 'N/A'} in Community</Text>
                </View>
              )}
            </View>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons 
                    name={isEditing ? 'close' : 'pencil'} 
                    size={20} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
              </View>

              {isEditing ? (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={[styles.input, errors.username && styles.inputError]}
                      placeholder="Enter your username"
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                        style={styles.picker}
                        mode="dropdown"
                        enabled={false} // Gender cannot be changed after signup
                      >
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                      </Picker>
                    </View>
                    <Text style={styles.helperText}>Gender cannot be changed</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password (Optional)</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.passwordInput, errors.password && styles.inputError]}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={COLORS.gray}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  {formData.password.trim() && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Confirm New Password</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                          placeholder="Confirm new password"
                          value={formData.confirmPassword}
                          onChangeText={(value) => handleInputChange('confirmPassword', value)}
                          secureTextEntry={!showConfirmPassword}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <Ionicons
                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={COLORS.gray}
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>
                  )}

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={cancelEdit}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.saveButton, isLoading && styles.buttonDisabled]}
                      onPress={handleUpdateProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                      ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.profileInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Username:</Text>
                    <Text style={styles.infoValue}>{user?.username}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gender:</Text>
                    <Text style={styles.infoValue}>{user?.gender}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Sign Out Button */}
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              disabled={isLoading}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emailText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rankText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.warning,
    marginLeft: SPACING.xs,
  },
  profileContainer: {
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  editButton: {
    padding: SPACING.xs,
  },
  form: {
    // Form styles from auth screens
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    backgroundColor: COLORS.lightGray,
  },
  picker: {
    height: 50,
    opacity: 0.5,
  },
  helperText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondaryText,
    marginTop: SPACING.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    borderWidth: 0,
  },
  eyeButton: {
    padding: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 0.45,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 0.45,
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  profileInfo: {
    // Static profile display
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: DIMENSIONS.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white,
  },
  signOutButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default ProfileScreen; 