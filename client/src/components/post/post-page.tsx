import { useGetPostById } from "@/hooks/post/useGetPostById";
import { useParams } from "@tanstack/react-router";
import Spinner from "../ui/spinner";
import PostCard from "./post-card";
import CommentList from "../comment/comment-list";
import PostComment from "../comment/post-comment";

const PostPage = () => {
  const { postId } = useParams({ strict: false });

  const { data: post, isLoading, error } = useGetPostById({ postId });

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
};
export default PostPage;
