import { FaRegComment } from "react-icons/fa";
import { Button } from "../ui/button";
import { IPost } from "@/types/IPost";
import { Link } from "@tanstack/react-router";
import Spinner from "../ui/spinner";
import { useGetCommentCount } from "@/hooks/comment/useGetCommentCount";

const Comments = ({ post }: { post: IPost }) => {
  const { data, isLoading, error } = useGetCommentCount({ postId: post.id });

  if (isLoading) {
    return <Spinner size="4" />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }

  return (
    <Link to={`/posts/${post.id}`}>
      <div className="flex items-center">
        <Button type="button" size="icon" variant="link">
          <FaRegComment />
          <span className="text-xs text-muted-foreground">{data?.count || 0}</span>
        </Button>
      </div>
    </Link>
  );
};

export default Comments;
