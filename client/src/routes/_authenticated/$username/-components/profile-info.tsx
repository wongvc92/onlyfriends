import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Link1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import FriendStatus from "@/components/friend/friend-status";
import { getProfileByUsername } from "@/data/getProfile";

const ProfileInfo = () => {
  const auth = useAuth();
  const { username } = useParams({ strict: false });
  const { data: profile } = useQuery({ queryKey: [`profiles-${username}`], queryFn: () => getProfileByUsername(username!) });

  return (
    <>
      {profile && (
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
                    <p>{profile.name}</p>
                    <p className="text-muted-foreground text-xs">@{profile.username || username}</p>
                  </CardTitle>
                  {auth.user?.id !== profile.user_id && <FriendStatus peopleId={profile.user_id!} />}

                  <Link
                    to={profile ? `/${username}/edit` : `/${username}/add`}
                    className={`${profile !== undefined && profile.username === auth.user?.username ? "flex" : username === auth.user?.username ? "flex" : "hidden"}`}
                  >
                    <Button className="rounded-full" variant="outline">
                      {profile ? "Edit profile" : "Add profile"}
                    </Button>
                  </Link>
                </div>

                <CardDescription className="line-clamp-2">{profile?.bio || ""}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                {profile?.website && (
                  <>
                    <Link1Icon />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-normal text-sky-500 hover:underline">
                      {profile.website}
                    </a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon />
                {profile?.joined_date && `Joined ${format(new Date(profile.joined_date), "MMMM yyyy")}`}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileInfo;
