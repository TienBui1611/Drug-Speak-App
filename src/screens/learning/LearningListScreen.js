import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { 
  selectCurrentLearning, 
  selectFinished, 
  selectCurrentLearningCount, 
  selectFinishedCount 
} from '../../store/learningSlice';
import { selectDrugById } from '../../store/drugSlice';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../../constants';

// Separate component for learning drug items to properly use hooks
const LearningDrugItem = ({ drugId, onPress }) => {
  const drug = useSelector(state => selectDrugById(state, drugId));
  
  if (!drug) return null;

  return (
    <TouchableOpacity
      style={styles.drugItem}
      onPress={() => onPress(drug)}
    >
      <Text style={styles.drugName}>{drug.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );
};

const LearningListScreen = ({ navigation }) => {
  const currentLearning = useSelector(selectCurrentLearning);
  const finished = useSelector(selectFinished);
  const currentLearningCount = useSelector(selectCurrentLearningCount);
  const finishedCount = useSelector(selectFinishedCount);

  const [currentLearningExpanded, setCurrentLearningExpanded] = useState(false);
  const [finishedExpanded, setFinishedExpanded] = useState(false);

  const handleDrugPress = (drug) => {
    navigation.navigate('LearningScreen', {
      drugId: drug.id,
      drugName: drug.name,
    });
  };

  const renderDrugItem = ({ item: drugId }) => (
    <LearningDrugItem
      drugId={drugId}
      onPress={handleDrugPress}
    />
  );

  const renderSection = (title, count, expanded, onToggle, data) => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
        <Text style={styles.sectionTitle}>
          {title} ({count})
        </Text>
        <Ionicons 
          name={expanded ? "remove" : "add"} 
          size={24} 
          color={COLORS.primary} 
        />
      </TouchableOpacity>
      
      {expanded && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item}
          renderItem={renderDrugItem}
          style={styles.drugList}
        />
      )}
      
      {expanded && data.length === 0 && (
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>No drugs in this section</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSection(
        'Current Learning', 
        currentLearningCount, 
        currentLearningExpanded, 
        () => setCurrentLearningExpanded(!currentLearningExpanded),
        currentLearning
      )}
      
      {renderSection(
        'Finished', 
        finishedCount, 
        finishedExpanded, 
        () => setFinishedExpanded(!finishedExpanded),
        finished
      )}
      
      {currentLearningCount === 0 && finishedCount === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No drugs in your learning list yet.
          </Text>
          <Text style={styles.emptySubtext}>
            Go to the Drugs tab and tap "Study" on any drug to add it here.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: DIMENSIONS.borderRadius,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  drugList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  drugItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.lightGray,
    borderRadius: DIMENSIONS.borderRadius,
  },
  drugName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  emptySection: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LearningListScreen; 