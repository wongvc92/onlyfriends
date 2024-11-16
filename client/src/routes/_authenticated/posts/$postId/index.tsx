import CommentList from "@/components/comment/comment-list";
import PostComment from "@/components/comment/post-comment";
import PostCard from "@/components/post/post-card";
import Spinner from "@/components/ui/spinner";
import { getCommentCountByPostId } from "@/data/getCommentCountByPostId";
import { getPostByPostId } from "@/data/getPostByPostId";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/posts/$postId/")({
  component: PostPage,
});

function PostPage() {
  const { postId } = useParams({ strict: false });

  if (!postId) return;
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostByPostId(postId),
    retry: false,
  });

  const { data: commentCount } = useQuery({
    queryKey: ["commentsCount", postId],
    queryFn: () => getCommentCountByPostId(postId),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }

  if (!post) {
    return <div>Data not found</div>;
  }

  return (
    <>
      <PostCard post={post} />
      <CommentList post={post} />
      <PostComment post={post} />
    </>
  );
}
