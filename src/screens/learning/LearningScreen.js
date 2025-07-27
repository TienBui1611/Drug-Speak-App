import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { selectDrugById, selectAllCategories } from '../../store/drugSlice';
import { 
  moveToFinished, 
  removeFromCurrentLearning,
  selectIsFinished,
  selectIsInCurrentLearning,
} from '../../store/learningSlice';
import { syncStudyRecords, forceSyncStudyRecords } from '../../utils/studyRecordSync';
import PronunciationLabel from '../../components/PronunciationLabel';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../../constants';

const LearningScreen = ({ route, navigation }) => {
  const { drugId, drugName } = route.params;
  const dispatch = useDispatch();
  
  const drug = useSelector(state => selectDrugById(state, drugId));
  const categories = useSelector(selectAllCategories);
  const isFinished = useSelector(state => selectIsFinished(state, drugId));
  const isInCurrentLearning = useSelector(state => selectIsInCurrentLearning(state, drugId));

  // Recording states
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingSound, setRecordingSound] = useState(null);
  const [recordingPermission, setRecordingPermission] = useState(false);
  
  // Animation for recording button
  const scaleAnim = useState(new Animated.Value(1))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    checkRecordingPermissions();
    
    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        try {
          if (recording) {
            if (isRecording) {
              await recording.stopAndUnloadAsync();
            } else {
              await recording.unloadAsync();
            }
          }
          if (recordingSound) {
            await recordingSound.unloadAsync();
          }
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      cleanup();
    };
  }, []);

  const checkRecordingPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      setRecordingPermission(permission.granted);
      
      if (!permission.granted) {
        Alert.alert(
          'Microphone Permission Required',
          'Please enable microphone access in your device settings to use the recording feature.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking recording permissions:', error);
    }
  };

  const startRecording = async () => {
    if (!recordingPermission) {
      await checkRecordingPermissions();
      return;
    }

    if (isRecording || recording) {
      console.log('Recording already in progress');
      return;
    }

    try {
      // Stop any existing recording sound first
      if (recordingSound) {
        await recordingSound.unloadAsync();
        setRecordingSound(null);
        setIsPlayingRecording(false);
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Scale down button
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
      setRecording(null);
      
      if (error.message.includes('Only one Recording object')) {
        Alert.alert('Recording Error', 'Please wait a moment before trying to record again.');
      } else if (error.message.includes('AudioFocusNotAcquiredException')) {
        Alert.alert('Recording Error', 'Please make sure the app is in the foreground and try again.');
      } else {
        Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
      }
    }
  };

  const stopRecording = async () => {
    if (!recording || !isRecording) return;

    try {
      setIsRecording(false);
      
      // Stop animations
      pulseAnim.stopAnimation();
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      const currentRecording = recording;
      setRecording(null);

      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
      
      if (uri) {
        setRecordedURI(uri);
        Alert.alert('Recording Complete', 'Tap the play button to hear your pronunciation!');
      } else {
        Alert.alert('Recording Error', 'Failed to save recording. Please try again.');
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
      setRecording(null);
      Alert.alert('Recording Error', 'Failed to save recording. Please try again.');
    }
  };

  const playRecording = async () => {
    if (!recordedURI) return;

    try {
      if (isPlayingRecording && recordingSound) {
        // Stop current playback
        await recordingSound.stopAsync();
        setIsPlayingRecording(false);
        return;
      }

      // Unload previous sound
      if (recordingSound) {
        await recordingSound.unloadAsync();
        setRecordingSound(null);
      }

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordedURI },
        { shouldPlay: true }
      );

      setRecordingSound(newSound);
      setIsPlayingRecording(true);

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingRecording(false);
        }
      });

    } catch (error) {
      console.error('Failed to play recording:', error);
      setIsPlayingRecording(false);
      
      if (error.message.includes('AudioFocusNotAcquiredException')) {
        Alert.alert('Playback Error', 'Please make sure the app is in the foreground and try again.');
      } else {
        Alert.alert('Playback Error', 'Failed to play recording. Please try again.');
      }
    }
  };

  const clearRecording = async () => {
    Alert.alert(
      'Clear Recording',
      'Are you sure you want to delete your recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Stop any playing recording
              if (recordingSound) {
                if (isPlayingRecording) {
                  await recordingSound.stopAsync();
                }
                await recordingSound.unloadAsync();
                setRecordingSound(null);
              }
              
              setRecordedURI(null);
              setIsPlayingRecording(false);
            } catch (error) {
              console.error('Error clearing recording:', error);
              // Still clear the state even if cleanup fails
              setRecordedURI(null);
              setIsPlayingRecording(false);
              setRecordingSound(null);
            }
          },
        },
      ]
    );
  };

  if (!drug) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Drug not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleFinish = async () => {
    Alert.alert(
      'Mark as Finished',
      'Are you sure you want to mark this drug as finished? It will be moved to your completed list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          style: 'default',
          onPress: async () => {
            dispatch(moveToFinished(drugId));
            try {
              await forceSyncStudyRecords();
              Alert.alert('Success', 'Drug marked as finished!');
              navigation.goBack();
            } catch (error) {
              // Sync failed but local state is updated
              Alert.alert('Finished', 'Drug marked as finished! (Sync will retry automatically)');
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove from Learning',
      'Are you sure you want to remove this drug from your learning list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFromCurrentLearning(drugId));
            syncStudyRecords();
            Alert.alert('Removed', 'Drug removed from your learning list.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const drugCategories = drug.categories.map(catId => categories[catId]?.name).filter(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Drug Header */}
          <View style={styles.header}>
            <Text style={styles.drugName}>{drug.name}</Text>
            {drug.molecular_formula && (
              <Text style={styles.molecularFormula}>
                Molecular Formula: {drug.molecular_formula}
              </Text>
            )}
            {drug.description && (
              <Text style={styles.description}>{drug.description}</Text>
            )}
          </View>

          {/* Categories */}
          {drugCategories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories:</Text>
              <View style={styles.categoriesContainer}>
                {drugCategories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pronunciations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pronunciations:</Text>
            {drug.sounds && drug.sounds.length > 0 ? (
              drug.sounds.map((audioItem, index) => (
                <PronunciationLabel
                  key={index}
                  drugId={drugId}
                  audioFile={audioItem.file}
                  gender={audioItem.gender}
                  showStudyButton={false} // Don't show study button in learning screen
                />
              ))
            ) : (
              <Text style={styles.noAudioText}>No pronunciations available</Text>
            )}
          </View>

          {/* Recording Practice */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Recording:</Text>
            <View style={styles.recordingContainer}>
              
              {/* Record Button */}
              <Animated.View style={{
                transform: [
                  { scale: scaleAnim },
                  { scale: isRecording ? pulseAnim : 1 }
                ]
              }}>
                <TouchableOpacity
                  style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                  disabled={!recordingPermission}
                >
                  <Ionicons 
                    name="mic" 
                    size={32} 
                    color={COLORS.white} 
                  />
                  <Text style={styles.recordButtonText}>
                    {isRecording ? 'Recording...' : 'Hold to Record'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Recording Controls */}
              {recordedURI && (
                <View style={styles.recordingControls}>
                  <TouchableOpacity
                    style={styles.playbackButton}
                    onPress={playRecording}
                  >
                    <Ionicons 
                      name={isPlayingRecording ? "pause" : "play"} 
                      size={24} 
                      color={COLORS.primary} 
                    />
                    <Text style={styles.playbackButtonText}>
                      {isPlayingRecording ? 'Stop' : 'Play Recording'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearRecording}
                  >
                    <Ionicons name="trash" size={20} color={COLORS.error} />
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!recordingPermission && (
                <Text style={styles.permissionText}>
                  Microphone permission required for recording
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {isInCurrentLearning && (
              <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                <Text style={styles.finishButtonText}>Mark as Finished</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
              <Ionicons name="trash" size={20} color={COLORS.error} />
              <Text style={styles.removeButtonText}>Remove from Learning</Text>
            </TouchableOpacity>
          </View>

          {isFinished && (
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  drugName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  molecularFormula: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: DIMENSIONS.borderRadius,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  noAudioText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.lightGray,
    borderRadius: DIMENSIONS.borderRadius,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: SPACING.lg,
  },
  recordButtonActive: {
    backgroundColor: COLORS.primary,
  },
  recordButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  playbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DIMENSIONS.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  playbackButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DIMENSIONS.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  permissionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  actionsContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    padding: SPACING.md,
    borderRadius: DIMENSIONS.borderRadius,
  },
  finishButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: DIMENSIONS.borderRadius,
  },
  removeButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    padding: SPACING.md,
    borderRadius: DIMENSIONS.borderRadius,
    marginTop: SPACING.lg,
  },
  completedText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
  },
});

export default LearningScreen; 