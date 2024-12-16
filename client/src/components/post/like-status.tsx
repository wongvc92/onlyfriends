import { IPost } from "@/types/IPost";
import LikeButton from "./like-button";
import UnLikeButton from "./dislike-button";
import Spinner from "../ui/spinner";
import { useGetLikeStatus } from "@/hooks/post/useGetLikeStatus";

const Likes = ({ post }: { post: IPost }) => {
  const { data, isLoading } = useGetLikeStatus({ postId: post.id });

  return (
    <div className="flex items-center">
      {isLoading ? <Spinner size="2" /> : data && data.isLiked === true ? <UnLikeButton post={post} /> : <LikeButton post={post} />}
      <span className="text-xs text-muted-foreground">{data?.likesCount}</span>
    </div>
  );
};

export default Likes;
