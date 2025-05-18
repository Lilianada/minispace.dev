import { db } from './firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';

// Storage categories
export interface StorageCategory {
  name: string;
  size: number;
  percentage: number;
}

// Storage usage data
export interface StorageUsageData {
  totalUsed: number;
  totalLimit: number;
  usedPercentage: number;
  categories: StorageCategory[];
}

/**
 * Calculate storage usage for a user
 * @param userId The user ID
 * @returns Promise with storage usage data
 */
export async function calculateStorageUsage(userId: string): Promise<StorageUsageData> {
  try {
    // Get user document to check storage limit
    const userRef = doc(db, 'Users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }
    
    const userData = userDoc.data();
    const storageLimit = userData.storageLimit || 104857600; // Default 100MB in bytes
    const storageUsed = userData.storageUsed || 0; // Get stored usage if available
    
    // Initialize storage categories
    const categories: StorageCategory[] = [
      { name: 'Posts', size: 0, percentage: 0 },
      { name: 'Images', size: 0, percentage: 0 },
      { name: 'Files', size: 0, percentage: 0 },
      { name: 'Other', size: 0, percentage: 0 }
    ];
    
    // Calculate posts size
    const postsRef = collection(db, 'Users', userId, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    let postsSize = 0;
    
    postsSnapshot.forEach(postDoc => {
      const postData = JSON.stringify(postDoc.data());
      postsSize += new Blob([postData]).size;
    });
    
    categories[0].size = postsSize;
    
    // Determine if we should try to access Firebase Storage
    const isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    // For development or if we have stored usage data, use that instead of trying to access Storage
    if (isDevelopment || storageUsed > 0) {
      console.log('Using stored or estimated storage data');
      
      // If we have stored usage data, use it to estimate the breakdown
      if (storageUsed > 0) {
        // Posts are already calculated accurately
        const remainingStorage = storageUsed - postsSize;
        
        // Estimate: 60% images, 30% files, 10% other
        categories[1].size = Math.floor(remainingStorage * 0.6); // Images
        categories[2].size = Math.floor(remainingStorage * 0.3); // Files
        categories[3].size = Math.floor(remainingStorage * 0.1); // Other
      } else {
        // No stored data, use mock data for development
        categories[1].size = 1024 * 1024 * 5; // 5MB for images
        categories[2].size = 1024 * 1024 * 2; // 2MB for files
        categories[3].size = 1024 * 1024 * 1; // 1MB for other
      }
    } else {
      // In production with no stored data, try to calculate from Storage
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `users/${userId}`);
        
        const listResult = await listAll(storageRef);
        
        // Process images
        const imagePromises = listResult.items
          .filter(item => item.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
          .map(async item => {
            try {
              const metadata = await getMetadata(item);
              return metadata.size || 0;
            } catch (e) {
              console.error('Error getting metadata for image:', e);
              return 0;
            }
          });
        
        // Process other files
        const filePromises = listResult.items
          .filter(item => !item.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
          .map(async item => {
            try {
              const metadata = await getMetadata(item);
              return metadata.size || 0;
            } catch (e) {
              console.error('Error getting metadata for file:', e);
              return 0;
            }
          });
        
        const imageSizes = await Promise.all(imagePromises);
        const fileSizes = await Promise.all(filePromises);
        
        categories[1].size = imageSizes.reduce((total, size) => total + size, 0);
        categories[2].size = fileSizes.reduce((total, size) => total + size, 0);
      } catch (error) {
        console.error('Error calculating storage from Firebase Storage:', error);
        // Use reasonable estimates
        categories[1].size = 1024 * 1024 * 3; // 3MB for images
        categories[2].size = 1024 * 1024 * 1; // 1MB for files
      }
    }
    
    // Calculate total used storage
    const totalUsed = categories.reduce((total, category) => total + category.size, 0);
    
    // Calculate percentages
    categories.forEach(category => {
      category.percentage = totalUsed > 0 ? (category.size / totalUsed) * 100 : 0;
    });
    
    // Update user document with current storage usage
    await updateDoc(userRef, {
      storageUsed: totalUsed
    });
    
    return {
      totalUsed,
      totalLimit: storageLimit,
      usedPercentage: (totalUsed / storageLimit) * 100,
      categories
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    // Return default values if there's an error
    return {
      totalUsed: 0,
      totalLimit: 104857600, // 100MB
      usedPercentage: 0,
      categories: [
        { name: 'Posts', size: 0, percentage: 0 },
        { name: 'Images', size: 0, percentage: 0 },
        { name: 'Files', size: 0, percentage: 0 },
        { name: 'Other', size: 0, percentage: 0 }
      ]
    };
  }
}

/**
 * Format bytes to human-readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
