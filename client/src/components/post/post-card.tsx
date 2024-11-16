import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotFilledIcon } from "@radix-ui/react-icons";
import Likes from "./Likes";
import { PiShareFatBold } from "react-icons/pi";
import { Link, useLocation } from "@tanstack/react-router";
import { getrelativeTime } from "@/utils/getrelativeTime";
import { IPost } from "@/types/IPost";
import PostACtion from "./post-action";
import Comments from "../comment/comments";
import { useState } from "react";
import EditPostForm from "./edit-post-form";
import PostContent from "./post-content";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { cn } from "@/lib/utils";

const PostCard = ({ post }: { post: IPost }) => {
  const [isEdit, setIsEdit] = useState(false);

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <Card
      key={post.id}
      className="border-0 shadow-none px-0 border-b rounded-none"
    >
      <CardHeader
        className={cn(
          pathname === `/posts/${post.id}` && `sticky top-0 bg-white z-10`
        )}
      >
        <div className="flex gap-1">
          <Link to={`/${post.username}`}>
            <ProfileImage image={post.display_image} username={post.username} />
          </Link>
          <CardTitle className="flex flex-wrap items-center gap-1">
            <ProfileName name={post.name} />
            <ProfileUsername username={post.username} />
            <DotFilledIcon />
            <p className="text-muted-foreground font-light">
              {getrelativeTime(post.created_at)}
            </p>
          </CardTitle>
          <Link to={`/posts/${post.id}`} className="flex-grow">
            <div className="flex-grow w-full border opacity-0">click here</div>
          </Link>
          <div className="ml-auto">
            <PostACtion post={post} setIsEdit={setIsEdit} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEdit ? (
          <EditPostForm setIsEdit={setIsEdit} post={post} />
        ) : (
          <PostContent post={post} />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-start gap-6">
        <Likes post={post} />
        <Comments post={post} />
        <PiShareFatBold />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
