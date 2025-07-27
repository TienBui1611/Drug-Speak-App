import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectDrugById, selectAllCategories } from '../../store/drugSlice';
import PronunciationLabel from '../../components/PronunciationLabel';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../../constants';

const DrugDetailScreen = ({ route }) => {
  const { drugId } = route.params;
  const drug = useSelector(state => selectDrugById(state, drugId));
  const categories = useSelector(selectAllCategories);

  if (!drug) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Drug not found</Text>
      </View>
    );
  }

  const drugCategories = drug.categories.map(categoryId => 
    categories[categoryId]?.name
  ).filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Drug Name */}
      <Text style={styles.drugName}>{drug.name}</Text>
      
      {/* Other Names */}
      {drug.other_names && drug.other_names.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Also Known As:</Text>
          <Text style={styles.otherNames}>
            {drug.other_names.join(', ')}
          </Text>
        </View>
      )}

      {/* Molecular Formula */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Molecular Formula:</Text>
        <Text style={styles.molecularFormula}>{drug.molecular_formula}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description:</Text>
        <Text style={styles.description}>{drug.desc}</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories:</Text>
        <Text style={styles.categories}>
          {drugCategories.join(', ')}
        </Text>
      </View>

      {/* Pronunciation Labels */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pronunciations:</Text>
        {drug.sounds.map((sound, index) => (
          <PronunciationLabel
            key={index}
            drugId={drug.id}
            audioFile={sound.file}
            gender={sound.gender}
            showStudyButton={true}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  drugName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  otherNames: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
  },
  molecularFormula: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: 'monospace',
    backgroundColor: COLORS.lightGray,
    padding: SPACING.sm,
    borderRadius: DIMENSIONS.borderRadius,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    lineHeight: 22,
  },
  categories: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default DrugDetailScreen; 