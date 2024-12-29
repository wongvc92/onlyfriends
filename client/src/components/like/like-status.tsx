import LikeButton from "./like-button";
import UnLikeButton from "./dislike-button";

const LikeStatus = ({ postId, like_count, is_liked }: { postId: string; like_count: number; is_liked: boolean }) => {
  return (
    <div className="flex items-center">
      {is_liked === true ? <UnLikeButton postId={postId} /> : <LikeButton postId={postId} />}
      <span className="text-xs text-muted-foreground">{like_count}</span>
    </div>
  );
};

export default LikeStatus;
