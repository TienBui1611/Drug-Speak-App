import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectDrugsByCategory } from '../../store/drugSlice';
import { selectIsInLearningList } from '../../store/learningSlice';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../../constants';

// Separate component for drug items to properly use hooks
const DrugItem = ({ drug, onPress }) => {
  const isInLearningList = useSelector(state => selectIsInLearningList(state, drug.id));
  
  return (
    <TouchableOpacity
      style={[
        styles.drugCard,
        isInLearningList && styles.drugCardInLearning
      ]}
      onPress={onPress}
    >
      <View style={styles.drugHeader}>
        <Text style={[
          styles.drugName,
          isInLearningList && styles.drugNameInLearning
        ]}>
          {drug.name}
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={COLORS.gray} 
        />
      </View>
      {drug.other_names && drug.other_names.length > 0 && (
        <Text style={[
          styles.otherNames,
          isInLearningList && styles.otherNamesInLearning
        ]}>
          Also known as: {drug.other_names.join(', ')}
        </Text>
      )}
      <Text style={[
        styles.drugDescription,
        isInLearningList && styles.drugDescriptionInLearning
      ]}>
        {drug.desc}
      </Text>
      {isInLearningList && (
        <View style={styles.learningIndicator}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.learningText}>In Learning List</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const DrugListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const drugs = useSelector(state => selectDrugsByCategory(state, categoryId));

  const renderDrugItem = ({ item }) => (
    <DrugItem
      drug={item}
      onPress={() => navigation.navigate('DrugDetail', {
        drugId: item.id,
        drugName: item.name,
      })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={drugs}
        keyExtractor={(item) => item.id}
        renderItem={renderDrugItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No drugs found in this category</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: SPACING.md,
  },
  drugCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.md,
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
  drugCardInLearning: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  drugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  drugName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  drugNameInLearning: {
    color: COLORS.gray,
  },
  otherNames: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  otherNamesInLearning: {
    color: COLORS.gray,
  },
  drugDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  drugDescriptionInLearning: {
    color: COLORS.gray,
  },
  learningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  learningText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
  },
});

export default DrugListScreen; 