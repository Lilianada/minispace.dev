// Helper function to safely get user ID from various auth systems
function getUserId(user: any): string | null {
  if (!user) return null;
  
  // Firebase Auth user
  if (typeof user.uid === 'string') return user.uid;
  
  // NextAuth user 
  if (typeof user.id === 'string') return user.id;
  
  // Session user with name field
  if (typeof user.name === 'string') return user.name;
  
  // Last resort, try to extract from email
  if (typeof user.email === 'string') {
    return user.email.replace('@', '_at_');
  }
  
  return null;
}
