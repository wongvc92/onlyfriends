import { IPost } from "@/types/IPost";
import LikeButton from "./like-button";
import { useQuery } from "@tanstack/react-query";
import { getLikeByPostId } from "@/data/getLikeByPostId";
import UnLikeButton from "./unlike-button";
import Spinner from "../ui/spinner";

const Likes = ({ post }: { post: IPost }) => {
  const { data, isLoading, error } = useQuery({ queryKey: [`likes-${post.id}`], queryFn: () => getLikeByPostId(post.id) });

  console.log("data", data);
  return (
    <div className="flex items-center">
      {isLoading ? <Spinner size="2" /> : data && data.isLiked === true ? <UnLikeButton post={post} /> : <LikeButton post={post} />}
      <span className="text-xs text-muted-foreground">{data?.likesCount}</span>
    </div>
  );
};

export default Likes;
