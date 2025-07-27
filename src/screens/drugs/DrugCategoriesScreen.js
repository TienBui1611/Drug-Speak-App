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
import { selectAllDrugs, selectAllCategories } from '../../store/drugSlice';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../../constants';

const DrugCategoriesScreen = ({ navigation }) => {
  const drugs = useSelector(selectAllDrugs);
  const categories = useSelector(selectAllCategories);

  // Convert categories object to array and add drug counts
  const categoriesArray = Object.values(categories).map(category => {
    const categoryDrugs = drugs.filter(drug => 
      drug.categories.includes(category.id)
    );
    return {
      ...category,
      drugCount: categoryDrugs.length,
    };
  });

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('DrugList', {
        categoryId: item.id,
        categoryName: item.name,
      })}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>
          {item.name} ({item.drugCount})
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={COLORS.gray} 
        />
      </View>
      <Text style={styles.categoryDescription}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesArray}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  categoryDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
});

export default DrugCategoriesScreen; 