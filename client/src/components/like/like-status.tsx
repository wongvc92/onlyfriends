import LikeButton from "./like-button";
import UnLikeButton from "./dislike-button";
import { IPost } from "@/types/IPost";

const LikeStatus = ({ post }: { post: IPost }) => {
  return (
    <div className="flex items-center">
      {post.is_liked === true ? <UnLikeButton post={post} /> : <LikeButton post={post} />}
      <span className="text-xs text-muted-foreground">{post.like_count}</span>
    </div>
  );
};

export default LikeStatus;
