import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import UserSiteClient from './user-site-client';

export default function UserProfilePage({ params }: { params: { username: string } }) {
  // Use React.use() to unwrap the params promise
  const resolvedParams = React.use(params);
  // const { username } = resolvedParams;
  
  return <UserSiteClient/>;
}
