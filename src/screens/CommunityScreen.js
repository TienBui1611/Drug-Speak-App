import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchAllStudyRecords,
  selectLeaderboard,
  selectStudyRecordsLoading,
  selectStudyRecordsError,
} from '../store/studyRecordsSlice';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../constants';

const CommunityScreen = () => {
  const dispatch = useDispatch();
  const leaderboard = useSelector(selectLeaderboard);
  const isLoading = useSelector(selectStudyRecordsLoading);
  const error = useSelector(selectStudyRecordsError);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      await dispatch(fetchAllStudyRecords()).unwrap();
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const rank = index + 1;
    
    // Determine medal/trophy color based on rank
    let rankColor = COLORS.gray;
    let rankIcon = 'trophy-outline';
    
    if (rank === 1) {
      rankColor = '#FFD700'; // Gold
      rankIcon = 'trophy';
    } else if (rank === 2) {
      rankColor = '#C0C0C0'; // Silver
      rankIcon = 'trophy';
    } else if (rank === 3) {
      rankColor = '#CD7F32'; // Bronze
      rankIcon = 'trophy';
    }

    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          <Ionicons name={rankIcon} size={24} color={rankColor} />
          <Text style={[styles.rankText, { color: rankColor }]}>#{String(rank)}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.username}>
              {item.user?.username || 'Unknown'}
            </Text>
            <Ionicons 
              name={item.user?.gender === 'male' ? 'man' : 'woman'} 
              size={20} 
              color={item.user?.gender === 'male' ? COLORS.primary : COLORS.secondary} 
            />
          </View>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{String(item.totalScore || 0)}</Text>
              <Text style={styles.statLabel}>Total Score</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{String(item.currentLearning || 0)}</Text>
              <Text style={styles.statLabel}>Learning</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{String(item.finishedLearning || 0)}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Community Leaderboard</Text>
      <Text style={styles.subtitle}>
        See how you rank against other Drug Speak learners
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No Community Data</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to start learning and appear on the leaderboard!
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="warning-outline" size={64} color={COLORS.error} />
      <Text style={styles.errorTitle}>Failed to Load Leaderboard</Text>
      <Text style={styles.errorSubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadLeaderboard}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && leaderboard.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading community data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.userId}
        renderItem={renderLeaderboardItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: DIMENSIONS.borderRadius,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  rankContainer: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    minWidth: 60,
  },
  rankText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  username: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.secondaryText,
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  errorTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.error,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  errorSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.borderRadius,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});

export default CommunityScreen; 