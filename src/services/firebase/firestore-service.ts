/**
 * Firestore Service
 * 
 * Centralizes all Firestore database operations.
 * Provides a clean API for database interactions throughout the app.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Generic type for Firestore document data with ID
 */
export type FirestoreDocument<T = DocumentData> = T & { id: string };

/**
 * Convert a Firestore document to a typed object with ID
 */
export function convertDocument<T>(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): FirestoreDocument<T> {
  const data = doc.data() as T;
  return {
    ...data,
    id: doc.id
  };
}

/**
 * Standardized timestamp conversion for Firestore dates
 */
export function convertTimestamps<T>(data: any): T {
  if (!data) return data;
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => convertTimestamps(item)) as unknown as T;
  }
  
  // If not an object, return as is
  if (typeof data !== 'object') {
    return data;
  }

  // Convert Firestore Timestamps to JavaScript Dates
  const result: any = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Convert Timestamp objects to JavaScript Dates
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } 
    // Recursively handle nested objects
    else if (value !== null && typeof value === 'object') {
      result[key] = convertTimestamps(value);
    } 
    // Keep other values as is
    else {
      result[key] = value;
    }
  });
  
  return result as T;
}

/**
 * Create a document with specified ID
 */
export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string, 
  data: T
): Promise<void> {
  await setDoc(doc(db, collectionPath, docId), data);
}

/**
 * Update an existing document
 */
export async function updateDocument<T>(
  collectionPath: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  await updateDoc(doc(db, collectionPath, docId), data as DocumentData);
}

/**
 * Get a single document by ID
 */
export async function getDocument<T>(
  collectionPath: string,
  docId: string
): Promise<FirestoreDocument<T> | null> {
  const docSnap = await getDoc(doc(db, collectionPath, docId));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return convertTimestamps({
    ...docSnap.data(),
    id: docSnap.id
  });
}

/**
 * Delete a document by ID
 */
export async function deleteDocument(
  collectionPath: string,
  docId: string
): Promise<void> {
  await deleteDoc(doc(db, collectionPath, docId));
}

/**
 * Query for documents in a collection
 */
export async function queryDocuments<T>(
  collectionPath: string,
  conditions: {
    field: string;
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
    value: any;
  }[] = [],
  sortOptions: {
    field: string;
    direction: 'asc' | 'desc';
  }[] = [],
  limitCount?: number
): Promise<FirestoreDocument<T>[]> {
  try {
    // Build the query with conditions
    let q = query(collection(db, collectionPath));
    
    // Apply where conditions
    conditions.forEach(condition => {
      q = query(
        q, 
        where(condition.field, condition.operator, condition.value)
      );
    });
    
    // Apply sorting
    sortOptions.forEach(sortOption => {
      q = query(
        q,
        orderBy(sortOption.field, sortOption.direction)
      );
    });
    
    // Apply limit if specified
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Process and return results
    const result: FirestoreDocument<T>[] = [];
    querySnapshot.forEach(doc => {
      result.push(convertTimestamps({
        ...doc.data(),
        id: doc.id
      }));
    });
    
    return result;
  } catch (error) {
    console.error(`Error querying documents in ${collectionPath}:`, error);
    throw error;
  }
}
