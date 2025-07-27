import { store } from '../store/store';
import { updateStudyRecord } from '../store/studyRecordsSlice';
import { selectStudyRecordData } from '../store/learningSlice';
import { selectUser } from '../store/authSlice';

// Debounce function to prevent too many API calls
let syncTimeout = null;
const SYNC_DELAY = 2000; // 2 seconds

/**
 * Sync current learning progress with backend
 * This function is debounced to prevent excessive API calls
 */
export const syncStudyRecords = () => {
  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Set new timeout
  syncTimeout = setTimeout(async () => {
    try {
      const state = store.getState();
      const user = selectUser(state);
      
      // Only sync if user is authenticated
      if (!user?.id) {
        return;
      }

      const studyData = selectStudyRecordData(state);
      
      // Dispatch the update action
      await store.dispatch(updateStudyRecord(studyData)).unwrap();
      
      console.log('Study records synced successfully:', studyData);
    } catch (error) {
      console.error('Failed to sync study records:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }, SYNC_DELAY);
};

/**
 * Force immediate sync (useful for important events like completing a drug)
 */
export const forceSyncStudyRecords = async () => {
  // Clear any pending sync
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }

  try {
    const state = store.getState();
    const user = selectUser(state);
    
    if (!user?.id) {
      return;
    }

    const studyData = selectStudyRecordData(state);
    await store.dispatch(updateStudyRecord(studyData)).unwrap();
    
    console.log('Study records force synced:', studyData);
  } catch (error) {
    console.error('Failed to force sync study records:', error);
    throw error; // Re-throw for force sync to handle errors appropriately
  }
};

/**
 * Clear sync timeout (useful for cleanup)
 */
export const clearSyncTimeout = () => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
}; 