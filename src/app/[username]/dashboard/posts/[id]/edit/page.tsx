import { Metadata } from 'next';
import EditPostPage from './page.client';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Minispace',
  description: 'Edit your existing blog post',
};

export default function Page(props: {
  params: { id: string; username: string };
}) {
  return <EditPostPage postId={props.params.id} />;
}
