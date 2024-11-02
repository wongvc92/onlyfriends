import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getProfileByUsername } from "@/data/getProfile";

const ProfileInfo = () => {
  const auth = useAuth();
  const { username } = useParams({ strict: false });
  console.log("username", username);

  const { data: profile } = useQuery({ queryKey: [`profiles-${username}`], queryFn: () => getProfileByUsername(username!) });

  console.log("profile", profile);
  return (
    <div>
      <div className="h-[150px] md:h-[200px] w-full relative">
        <img src="https://github.com/shadcn.png" alt="banner" className="w-full h-full object-cover rounded-t-md" />
        <Avatar className="absolute top-1/2 left-5 w-24 h-24 md:w-32 md:h-32 border-white shadow-lg border-4">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <Card className="rounded-none rounded-b-md pt-8">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex flex-wrap items-center gap-1">
                <p>{profile?.name}</p>
                <p className="text-muted-foreground text-xs">@{profile?.username || username}</p>
              </CardTitle>
              <Link to={profile ? `/${username}/edit` : `/${username}/add`} className={`${profile?.id === auth.user?.id ? "flex" : "hidden"}`}>
                <Button className="rounded-full" variant="outline">
                  {profile ? "Edit profile" : "Add profile"}
                </Button>
              </Link>
            </div>

            <CardDescription className="line-clamp-2">{profile?.bio || ""}</CardDescription>
          </div>
        </CardHeader>

        {/* <CardContent>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam, placeat.</CardContent> */}
      </Card>
    </div>
  );
};

export default ProfileInfo;
