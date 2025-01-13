import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { PiShareFatBold } from "react-icons/pi";
import { Link, useLocation } from "@tanstack/react-router";
import { getrelativeTime } from "@/utils/getrelativeTime";
import { IPost } from "@/types/IPost";
import Comments from "../comment/comments";
import { useState } from "react";
import EditPostForm from "./edit-post-form";
import PostContent from "./post-content";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { cn } from "@/lib/utils";
import PostAction from "./post-action";
import LikeStatus from "../like/like-status";

const PostCard = ({ post }: { post: IPost }) => {
  const [isEdit, setIsEdit] = useState(false);

  const startEdit = () => setIsEdit(true);
  const stopEdit = () => setIsEdit(false);

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <Card key={post.id} className="border-0 shadow-none px-0 border-b rounded-none">
      <CardHeader className={cn(pathname === `/posts/${post.id}` && ` bg-white dark:bg-background z-10`)}>
        <div className="flex gap-1">
          <Link to={"/posts/$postId"} params={{ postId: post.id }}>
            <ProfileImage image={post.display_image} username={post.username} />
          </Link>
          <CardTitle className="flex flex-wrap items-center gap-1">
            <ProfileName name={post.name} />
            <ProfileUsername username={post.username} />
            <DotFilledIcon />
            <p className="text-muted-foreground font-light">{getrelativeTime(post.created_at)}</p>
          </CardTitle>
          <Link to={"/posts/$postId"} params={{ postId: post.id }} className="flex-grow">
            <div className="flex-grow w-full border opacity-0">click here</div>
          </Link>
          <div className="ml-auto">
            <PostAction post={post} startEdit={startEdit} />
          </div>
        </div>
      </CardHeader>

      <CardContent>{isEdit ? <EditPostForm stopEdit={stopEdit} post={post} /> : <PostContent post={post} />}</CardContent>
      <CardFooter className="flex items-center justify-start gap-6">
        <LikeStatus post={post} />
        <Comments comment_count={post.comment_count} postId={post.id} />
        <PiShareFatBold />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
