import { useAuth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPostsByUserId } from "@/data/postsByUserId";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";

const PostCard = () => {
  const { user } = useAuth();
  console.log("useAuth", user);
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPostsByUserId,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const getrelativeTime = (date: Date) => {
    const relativeTime = formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
      roundingMethod: "floor",
    })
      .replace("minutes", "m")
      .replace("minute", "m")
      .replace("hours", "h")
      .replace("hour", "h")
      .replace("days", "d")
      .replace("day", "d")
      .replace("weeks", "w")
      .replace("week", "w")
      .replace("months", "mo")
      .replace("month", "mo")
      .replace("years", "y")
      .replace("year", "y");
    return relativeTime;
  };

  return (
    <div className="flex flex-col gap-2">
      {!!data.posts.length &&
        data.posts.map((post: any) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex gap-1 items-start">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle className="text-muted-foreground">@{user?.username}</CardTitle>
                <CardDescription> {getrelativeTime(post.created_at)}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>{post.post}</CardContent>
          </Card>
        ))}
    </div>
  );
};

export default PostCard;
