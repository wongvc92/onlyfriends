import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";

const Banner = () => {
  const { user } = useAuth();
  const { username } = useParams({ strict: false });
  return (
    <div>
      <div className="h-[150px] md:h-[200px] w-full">
        <img src="https://github.com/shadcn.png" alt="banner" className="w-full h-full object-cover rounded-t-md" />
      </div>

      <Card className="rounded-none rounded-b-md">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Link to={`/${username}/edit`}>
                <Button className="rounded-full" variant="outline">
                  Edit profile
                </Button>
              </Link>
            </div>
            <CardTitle className="text-muted-foreground">@{user?.username}</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo facilis, quibusdam placeat distinctio blanditiis tempora dignissimos,
            </CardDescription>
          </div>
        </CardHeader>

        {/* <CardContent>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam, placeat.</CardContent> */}
      </Card>
    </div>
  );
};

export default Banner;
