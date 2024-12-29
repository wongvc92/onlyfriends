import { FaRegComment } from "react-icons/fa";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

const Comments = ({ comment_count, postId }: { comment_count: number; postId: string }) => {
  return (
    <Link to={`/posts/${postId}`}>
      <div className="flex items-center">
        <Button type="button" size="icon" variant="link">
          <FaRegComment />
          <span className="text-xs text-muted-foreground">{comment_count || 0}</span>
        </Button>
      </div>
    </Link>
  );
};

export default Comments;
