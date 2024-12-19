import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@tanstack/react-router";
import { CalendarIcon, ImageIcon, Link1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import FriendStatus from "@/components/friend/friend-status";
import ProfileImage from "./profile-image";
import ProfileName from "./profile-name";
import ProfileUsername from "./profile-username";
import { useGetProfile } from "@/hooks/profile/useGetProfile";
import CreateConversation from "../conversation/create-conversation";
import { useState } from "react";

const ProfileInfo = () => {
  const [imageError, setImageError] = useState(false);
  const auth = useAuth();
  const { username } = useParams({ strict: false });
  const { data: profile } = useGetProfile({ username });
  if (!profile) {
    return null;
  }
  const isSelfProfile = auth.user && auth.user.username === username ? true : false;

  return (
    <div className="w-full">
      {profile && (
        <div>
          <div className="h-[150px] md:h-[200px] relative">
            {imageError || !profile.banner_image ? (
              <Link to={`/${username}/edit`}>
                <div className="flex items-center justify-center h-full">
                  <ImageIcon />
                </div>
              </Link>
            ) : (
              <img src={profile.banner_image} alt="banner" className="w-full h-full object-cover rounded-t-md" onError={() => setImageError(true)} />
            )}

            <ProfileImage
              image={profile?.display_image}
              username={profile.username}
              classname="absolute top-1/2 left-5 w-24 h-24 md:w-32 md:h-32 border-white shadow-lg border-4"
            />
          </div>
          <Card className="rounded-none rounded-b-md pt-8 ">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex flex-wrap items-center gap-1">
                    <ProfileName name={profile.name} />
                    <ProfileUsername username={profile.username} classname="text-muted-foreground text-xs" />
                    {!isSelfProfile && <CreateConversation userId={profile.user_id} />}
                  </CardTitle>

                  {!isSelfProfile && <FriendStatus peopleId={profile.user_id!} />}

                  {isSelfProfile && (
                    <Link to={`/${username}/edit`}>
                      <Button className="rounded-full" variant="outline">
                        Edit profile
                      </Button>
                    </Link>
                  )}
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
    </div>
  );
};

export default ProfileInfo;
