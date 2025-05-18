import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PreviewClient from './page.client';

export const metadata: Metadata = {
  title: 'Post Preview | Minispace',
  description: 'Preview your blog post before publishing',
};

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    return notFound();
  }
  
  return <PreviewClient id={id} />;
}
