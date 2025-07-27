import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import { addToCurrentLearning } from '../store/learningSlice';
import { selectIsInLearningList } from '../store/learningSlice';
import { syncStudyRecords } from '../utils/studyRecordSync';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS, PLAYBACK_SPEEDS } from '../constants';

const PronunciationLabel = ({ 
  drugId,
  audioFile, 
  gender, 
  showStudyButton = true 
}) => {
  const dispatch = useDispatch();
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const isInLearningList = useSelector(state => selectIsInLearningList(state, drugId));

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const getAudioSource = () => {
    // Map audio file names to require statements
    const audioMap = {
      'Celecoxib - female.wav': require('../assets/audio/Celecoxib - female.wav'),
      'Celecoxib 1 - male.wav': require('../assets/audio/Celecoxib 1 - male.wav'),
      'Chloramphenicol - female.wav': require('../assets/audio/Chloramphenicol - female.wav'),
      'Chloramphenicol 1 - male.wav': require('../assets/audio/Chloramphenicol 1 - male.wav'),
      'Dihydrocodeine - female.wav': require('../assets/audio/Dihydrocodeine - female.wav'),
      'Diphenoxylate - female.wav': require('../assets/audio/Diphenoxylate - female.wav'),
      'Diphenoxylate 1 - male.wav': require('../assets/audio/Diphenoxylate 1 - male.wav'),
      'Doxylamine - female.wav': require('../assets/audio/Doxylamine - female.wav'),
      'Famciclovir - female.wav': require('../assets/audio/Famciclovir - female.wav'),
      'Famciclovir 1 - male.wav': require('../assets/audio/Famciclovir 1 - male.wav'),
      'Fluconazole - female.wav': require('../assets/audio/Fluconazole - female.wav'),
      'Fluconazole 1 - male.wav': require('../assets/audio/Fluconazole 1 - male.wav'),
      'Glyceryl trinitrate - female.wav': require('../assets/audio/Glyceryl trinitrate - female.wav'),
      'Glyceryl trinitrate 1 - male.wav': require('../assets/audio/Glyceryl trinitrate 1 - male.wav'),
      'Hydrocortisone - female.wav': require('../assets/audio/Hydrocortisone - female.wav'),
      'Hydrocortisone 1 - male.wav': require('../assets/audio/Hydrocortisone 1 - male.wav'),
      'Ibuprofen - female.wav': require('../assets/audio/Ibuprofen - female.wav'),
      'Ibuprofen 1 - male.wav': require('../assets/audio/Ibuprofen 1 - male.wav'),
      'Levonorgestrel - female.wav': require('../assets/audio/Levonorgestrel - female.wav'),
      'Levonorgestrel 1 - male.wav': require('../assets/audio/Levonorgestrel 1 - male.wav'),
      'Melatonin - female.wav': require('../assets/audio/Melatonin - female.wav'),
      'Melatonin 1 - male.wav': require('../assets/audio/Melatonin 1 - male.wav'),
      'Metoclopramide - female.wav': require('../assets/audio/Metoclopramide - female.wav'),
      'Naloxone - female.wav': require('../assets/audio/Naloxone - female.wav'),
      'Naloxone 1 - male.wav': require('../assets/audio/Naloxone 1 - male.wav'),
      'Pantoprazole - female.wav': require('../assets/audio/Pantoprazole - female.wav'),
      'Pantoprazole 1 - male.wav': require('../assets/audio/Pantoprazole 1 - male.wav'),
      'Paracetamol - female.wav': require('../assets/audio/Paracetamol - female.wav'),
      'Paracetamol 1 - male.wav': require('../assets/audio/Paracetamol 1 - male.wav'),
      'Prochlorperazine - female.wav': require('../assets/audio/Prochlorperazine - female.wav'),
      'Promethazine - female.wav': require('../assets/audio/Promethazine - female.wav'),
      'Promethazine 1 - male.wav': require('../assets/audio/Promethazine 1 - male.wav'),
      'Pseudoephedrine - female.wav': require('../assets/audio/Pseudoephedrine - female.wav'),
      'Pseudoephedrine 1 - male.wav': require('../assets/audio/Pseudoephedrine 1 - male.wav'),
      'Salbutamol - female.wav': require('../assets/audio/Salbutamol - female.wav'),
      'Salbutamol 1 - male.wav': require('../assets/audio/Salbutamol 1 - male.wav'),
      'Sumatriptan - female.wav': require('../assets/audio/Sumatriptan - female.wav'),
      'Sumatriptan 1 - male.wav': require('../assets/audio/Sumatriptan 1 - male.wav'),
      'Terbutaline - female.wav': require('../assets/audio/Terbutaline - female.wav'),
      'Terbutaline 1 - male.wav': require('../assets/audio/Terbutaline 1 - male.wav'),
      'Triamcinolone - female.wav': require('../assets/audio/Triamcinolone - female.wav'),
      'Triamcinolone 1 - male.wav': require('../assets/audio/Triamcinolone 1 - male.wav'),
      'Ulipristal - female.wav': require('../assets/audio/Ulipristal - female.wav'),
      'Ulipristal 1 - male.wav': require('../assets/audio/Ulipristal 1 - male.wav'),
    };

    return audioMap[audioFile];
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      // Stop current playback
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const audioSource = getAudioSource();
      if (!audioSource) {
        Alert.alert('Error', 'Audio file not found');
        return;
      }

      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and load sound
      const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
      setSound(newSound);

      // Set playback rate (speed)
      await newSound.setRateAsync(selectedSpeed, true);

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      // Play the sound
      await newSound.playAsync();
      setIsPlaying(true);

    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio. Please try again.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeedChange = async (newSpeed) => {
    setSelectedSpeed(newSpeed);
    
    // If currently playing, update the playback rate
    if (sound && isPlaying) {
      try {
        await sound.setRateAsync(newSpeed, true);
      } catch (error) {
        console.error('Error changing playback speed:', error);
      }
    }
  };

  const handleAddToLearning = () => {
    if (drugId) {
      dispatch(addToCurrentLearning(drugId));
      Alert.alert('Success', 'Drug added to your learning list!');
      
      // Sync with backend
      syncStudyRecords();
    }
  };

  // Get the current speed label for display
  const currentSpeedLabel = PLAYBACK_SPEEDS.find(speed => speed.value === selectedSpeed)?.label || '1.0x';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity 
          style={[styles.speakerButton, isPlaying && styles.speakerButtonPlaying]}
          onPress={handlePlayAudio}
          disabled={isLoading}
        >
          {isLoading ? (
            <Ionicons 
              name="hourglass" 
              size={20} 
              color={COLORS.gray} 
            />
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "volume-medium"} 
              size={20} 
              color={isPlaying ? COLORS.primary : COLORS.gray} 
            />
          )}
        </TouchableOpacity>
        
        <View style={styles.genderIcon}>
          <Ionicons 
            name={gender === 'male' ? 'man' : 'woman'} 
            size={20} 
            color={gender === 'male' ? COLORS.primary : COLORS.secondary} 
          />
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.speedLabel}>Speed: {currentSpeedLabel}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSpeed}
              onValueChange={handleSpeedChange}
              style={styles.picker}
              mode="dropdown"
            >
              {PLAYBACK_SPEEDS.map(speed => (
                <Picker.Item 
                  key={speed.value} 
                  label={speed.label} 
                  value={speed.value}
                />
              ))}
            </Picker>
            <View style={styles.pickerOverlay}>
              <Text style={styles.pickerDisplayText}>{currentSpeedLabel}</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
            </View>
          </View>
        </View>

        {showStudyButton && !isInLearningList && (
          <TouchableOpacity 
            style={styles.studyButton}
            onPress={handleAddToLearning}
          >
            <Text style={styles.studyButtonText}>Study</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speakerButton: {
    padding: SPACING.sm,
    borderRadius: DIMENSIONS.borderRadius / 2,
    backgroundColor: COLORS.white,
  },
  speakerButtonPlaying: {
    backgroundColor: COLORS.lightBlue,
  },
  genderIcon: {
    padding: SPACING.sm,
  },
  speedSection: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  speedLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondaryText,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  pickerWrapper: {
    position: 'relative',
    height: 36,
  },
  picker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0, // Hide the actual picker but keep it functional
  },
  pickerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius / 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 36,
    paddingHorizontal: SPACING.sm,
    pointerEvents: 'none', // Allow touch events to pass through to picker below
  },
  pickerDisplayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
    marginRight: SPACING.xs,
  },
  studyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DIMENSIONS.borderRadius,
  },
  studyButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

export default PronunciationLabel; 