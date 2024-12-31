import { Card, CardHeader } from "@/components/ui/card";
import ProfileImage from "@/components/profile/profile-image";
import ProfileName from "@/components/profile/profile-name";
import ProfileUsername from "@/components/profile/profile-username";
import { useSearch } from "@tanstack/react-router";
import { useGetProfile } from "@/hooks/profile/useGetProfile";

const MessageProfile = () => {
  const { username } = useSearch({ strict: false });

  const { data: profile } = useGetProfile({ username });
  if (!profile) return null;
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardHeader>
        <div className="flex gap-2 items-center">
          <ProfileImage image={profile.display_image} username={profile.username} />
          <div className="flex items-center flex-wrap gap-1 ">
            <ProfileName name={profile.name} />
            <ProfileUsername username={profile.username} classname="text-muted-foreground text-xs" />

            {/* 
            <FriendStatus peopleId={profile.user_id!} /> */}
          </div>
        </div>
        {/* <CardDescription className="line-clamp-2">
            {profile?.bio || ""}
          </CardDescription> */}
      </CardHeader>
      {/* 
      <CardContent className="text-xs space-y-2  items-center  flex flex-col">
        <div className="flex items-center gap-2">
          {profile?.website && (
            <>
              <Link1Icon />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-sky-500 hover:underline"
              >
                {profile.website}
              </a>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          {profile?.joined_date &&
            `Joined ${format(new Date(profile.joined_date), "MMMM yyyy")}`}
        </div>
      </CardContent> */}
    </Card>
  );
};

export default MessageProfile;
