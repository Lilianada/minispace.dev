/**
 * User Avatar Component
 * 
 * Displays a user's avatar image with fallback to initials.
 * Common component used across multiple features.
 */
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { UserData } from '@/services/firebase/auth-service';

// Local interface for avatar display (less strict than full UserData)
interface AvatarUser {
  displayName?: string | null;
  photoURL?: string | null;
  username?: string;
  email?: string;
}

export interface UserAvatarProps {
  user: UserData | AvatarUser;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({ 
  user, 
  size = 'md', 
  className = '',
  onClick
}: UserAvatarProps) {
  // Determine size in pixels
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96
  };
  
  const pixelSize = sizeMap[size];
  
  // Get initials for fallback
  const getInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Generate random pastel color based on username or email for fallback avatar
  const getBackgroundColor = () => {
    const identifier = user.username || user.email || user.displayName || 'user';
    let hash = 0;
    
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a pastel color
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
      onClick={onClick}
    >
      {user.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || user.username || 'User avatar'}
          width={pixelSize}
          height={pixelSize}
          className="object-cover"
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center text-center"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          <span 
            className="text-gray-800 font-medium"
            style={{ fontSize: pixelSize * 0.4 }}
          >
            {getInitials()}
          </span>
        </div>
      )}
    </div>
  );
}
