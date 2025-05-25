import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export const DNS_CONFIG = {
  CNAME: {
    host: 'www',
    value: 'cname.minispace.dev'
  },
  A: {
    host: '@',
    value: '76.76.21.21'
  }
};

export interface DomainSettingsData {
  subdomain?: string;
  customDomain?: string;
  domainVerified?: boolean;
}

export interface SubdomainAvailabilityResult {
  isValid: boolean;
  isAvailable: boolean;
  message: string;
}

// Visit site functions
export const visitSubdomain = (subdomain: string) => {
  if (!subdomain) return;
  window.open(`https://${subdomain}.minispace.dev`, '_blank');
};

export const visitCustomDomain = (customDomain: string) => {
  if (!customDomain) return;
  window.open(`https://${customDomain}`, '_blank');
};

// Fetch domain settings
export const fetchDomainSettings = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');
  
  // Reference to the domain settings document
  const domainSettingsRef = doc(db, 'Users', userId, 'settings', 'domain');
  const docSnap = await getDoc(domainSettingsRef);

  // Also get the user document to get username
  const userDocRef = doc(db, 'Users', userId);
  const userDocSnap = await getDoc(userDocRef);
  
  let subdomain = '';
  let originalSubdomain = '';
  let customDomain = '';
  let domainVerified = false;
  
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    if (userData.username) {
      subdomain = userData.username;
      originalSubdomain = userData.username;
    }
  }

  if (docSnap.exists()) {
    const data = docSnap.data();
    
    // Update subdomain settings
    if (data.subdomain) {
      subdomain = data.subdomain;
      originalSubdomain = data.subdomain;
    }
    
    // Update custom domain settings
    if (data.customDomain) {
      customDomain = data.customDomain;
      domainVerified = data.domainVerified || false;
    }
  }
  
  return { subdomain, originalSubdomain, customDomain, domainVerified };
};

// Check if subdomain is available
export const checkSubdomainAvailability = async (subdomain: string, userId: string): Promise<false | SubdomainAvailabilityResult> => {
  if (!subdomain) return false;
  
  // Check if subdomain follows username rules
  const subdomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,20}$/;
  if (!subdomainRegex.test(subdomain)) {
    return { isValid: false, isAvailable: false, message: 'Subdomain must be 3-20 characters and can only contain letters, numbers, hyphens, and underscores.' };
  }

  // Check if username already exists
  const usersRef = collection(db, 'Users');
  const usernameQuery = query(usersRef, where('username', '==', subdomain));
  const querySnapshot = await getDocs(usernameQuery);
  
  const isAvailable = querySnapshot.empty || 
                    (querySnapshot.size === 1 && querySnapshot.docs[0].id === userId);
  
  return { 
    isValid: true, 
    isAvailable, 
    message: isAvailable ? 'Subdomain is available' : 'This subdomain is already taken. Please choose another one.'
  };
};

// Save subdomain settings
export const saveSubdomainSettings = async (userId: string, subdomain: string, originalSubdomain: string) => {
  if (!userId) throw new Error('User ID is required');
  if (!subdomain) throw new Error('Subdomain is required');
  
  // Reference to the domain settings document
  const domainSettingsRef = doc(db, 'Users', userId, 'settings', 'domain');
  
  try {
    // Start a batch write
    const { writeBatch } = await import('firebase/firestore');
    const batch = writeBatch(db);
    
    // Update domain settings
    batch.set(domainSettingsRef, {
      subdomain,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    // Update username in user document if changed
    if (subdomain !== originalSubdomain) {
      const userRef = doc(db, 'Users', userId);
      batch.update(userRef, {
        username: subdomain,
        displayName: subdomain, // Update displayName to match username
      });
    }
    
    await batch.commit();
    return true;
  } catch (error) {
    // Fallback if batch is not available
    await setDoc(domainSettingsRef, {
      subdomain,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    // Update username in user document if changed
    if (subdomain !== originalSubdomain) {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        username: subdomain,
        displayName: subdomain,
      });
    }
    return true;
  }
};

// Save custom domain settings
export const saveCustomDomain = async (userId: string, customDomain: string) => {
  if (!userId) throw new Error('User ID is required');
  if (!customDomain) throw new Error('Custom domain is required');

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  if (!domainRegex.test(customDomain)) {
    throw new Error('Please enter a valid domain name (e.g., example.com).');
  }

  // Reference to the domain settings document
  const domainSettingsRef = doc(db, 'Users', userId, 'settings', 'domain');
  
  // Update domain settings
  await setDoc(domainSettingsRef, {
    customDomain,
    domainVerified: false, // Reset verification status when domain changes
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return true;
};

// Verify custom domain
export const verifyCustomDomain = async (userId: string, customDomain: string) => {
  if (!userId) throw new Error('User ID is required');
  if (!customDomain) throw new Error('Custom domain is required');

  // In a real app, you would check if DNS records are properly configured
  // For this demo, we'll simulate a successful verification
  return new Promise<boolean>((resolve) => {
    setTimeout(async () => {
      try {
        // Reference to the domain settings document
        const domainSettingsRef = doc(db, 'Users', userId, 'settings', 'domain');
        
        // Update verification status
        await updateDoc(domainSettingsRef, {
          domainVerified: true,
          verifiedAt: serverTimestamp(),
        });
        
        resolve(true);
      } catch (error) {
        console.error('Error updating verification status:', error);
        resolve(false);
      }
    }, 1500);
  });
};

// Remove custom domain
export const removeCustomDomain = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');
  
  // Reference to the domain settings document
  const domainSettingsRef = doc(db, 'Users', userId, 'settings', 'domain');
  
  // Update domain settings to remove the custom domain
  await updateDoc(domainSettingsRef, {
    customDomain: '',
    domainVerified: false,
    updatedAt: serverTimestamp(),
  });
  
  return true;
};
