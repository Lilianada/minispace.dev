"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyedMutator } from "swr";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getDashboardPath } from "@/lib/route-utils";
import PostActionsDropdown from "./PostActionsDropdown";
import DeletePostDialog from "./DeletePostDialog";
import { PostsData } from "@/hooks/usePosts";

interface Post {
  id: string;
  title: string;
  slug?: string;
  status: "published" | "draft";
  updatedAt: string;
  views?: number;
  tags?: string[];
}

interface PostTableRowProps {
  post: Post;
  mutate: KeyedMutator<PostsData>;
}

export default function PostTableRow({
  post,
  mutate,
}: PostTableRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">
        <div>
          <Link
            href={getDashboardPath(`posts/${post.id}`)}
            className="font-medium text-foreground hover:underline"
          >
            {post.title}
          </Link>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{post.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </td>
      <td className="p-4 align-middle">
        <Badge variant={post.status === "published" ? "default" : "outline"}>
          {post.status === "published" ? "Published" : "Draft"}
        </Badge>
      </td>
      <td className="p-4 align-middle text-muted-foreground">
        {formatDate(post.updatedAt)}
      </td>
      <td className="p-4 align-middle text-right">{post.views || 0}</td>
      <td className="p-4 align-middle text-right">
        <div className="flex justify-end">
          <PostActionsDropdown
            post={post}
            onDeleteClick={() => setDeleteDialogOpen(true)}
            mutate={mutate}
          />

          {deleteDialogOpen && (
            <DeletePostDialog
              postId={post.id}
              postTitle={post.title}
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
