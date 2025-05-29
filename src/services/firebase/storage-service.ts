/**
 * Storage Service
 * 
 * Centralizes all Firebase Storage operations.
 * Provides a clean API for file operations throughout the app.
 */

import { getDownloadURL, ref, uploadBytes, uploadString, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  path: string, 
  file: File, 
  metadata?: any
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Upload a string (e.g., base64 data) to Firebase Storage
 */
export async function uploadBase64(
  path: string,
  data: string,
  format: 'data_url' | 'base64' | 'base64url' | 'raw' = 'data_url'
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    
    await uploadString(storageRef, data, format);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading string data:', error);
    throw new Error('Failed to upload data');
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw new Error('Failed to get file URL');
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}
