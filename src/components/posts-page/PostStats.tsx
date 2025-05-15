import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Post } from '@/lib/api/posts'; // Import the Post type from your API module

interface PostStatsProps {
  post: Post; // Use the Post type from the API module
}

export default function PostStats({ post }: PostStatsProps) {
  // Only show stats for published posts
  if (post.status !== 'published') {
    return null;
  }
  
  // Get stats with default values
  const views = post.views || 0;
  const comments = post.comments || 0;
  const likes = post.likes || 0;
  const shares = post.shares || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Views</p>
            <p className="text-2xl font-bold">{views}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Comments</p>
            <p className="text-2xl font-bold">{comments}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Likes</p>
            <p className="text-2xl font-bold">{likes}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Shares</p>
            <p className="text-2xl font-bold">{shares}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}