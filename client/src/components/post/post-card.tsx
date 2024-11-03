import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DotFilledIcon } from "@radix-ui/react-icons";
import Likes from "./Likes";
import { PiShareFatBold } from "react-icons/pi";
import { Link } from "@tanstack/react-router";
import { getrelativeTime } from "@/utils/getrelativeTime";
import { IPost } from "@/types/IPost";
import PostACtion from "./post-action";
import Comments from "../comment/comments";

const PostCard = ({ post }: { post: IPost }) => {
  return (
    <Card key={post.id}>
      <CardHeader>
        <div className="flex gap-1 items-start">
          <Link to={`/${post.username}`}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <CardTitle>
            <div className="flex flex-wrap items-center gap-1">
              <p className="line-clamp-2">{post.name}</p>
              <p className="text-muted-foreground font-light">@{post.username}</p>
              <DotFilledIcon />
              <p className="text-muted-foreground font-light">{getrelativeTime(post.created_at)}</p>
            </div>
          </CardTitle>

          <div className="ml-auto">
            <PostACtion post={post} />
          </div>
        </div>
      </CardHeader>

      <CardContent>{post.post}</CardContent>
      <CardFooter className="flex items-center justify-between md:justify-start md:gap-10">
        <Likes post={post} />
        <Comments post={post} />
        <PiShareFatBold />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
