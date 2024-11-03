import { getPeoples } from "@/data/getPeoples";
import { useQuery } from "@tanstack/react-query";
import AddFriendButton from "./add-friend-button";
import Spinner from "../ui/spinner";
import { Button } from "../ui/button";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";

const PeoplesList = () => {
  const { data: peoples, isLoading, error } = useQuery({ queryKey: ["peoples"], queryFn: getPeoples });

  console.log("peoples", peoples);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }
  return (
    <div className="border rounded-md p-2 space-y-4 ">
      <div>People you might know</div>
      <div className="space-y-4">
        {peoples?.map((people) => (
          <div key={people.id} className="flex items-start justify-between gap-1">
            <div className="flex items-start gap-2">
              <ProfileImage image="https://github.com/shadcn.png" username={people.username} classname="w-10 h-10" />
              <div>
                <ProfileName name={people.name} classname="font-bold text-sm" />
                <ProfileUsername username={people.username} classname="font-light text-muted-foreground text-xs" />
              </div>
            </div>
            <AddFriendButton peopleId={people.id} />
          </div>
        ))}
      </div>
      <Button type="button" variant="link" className="text-blue-500" size="sm">
        Show more
      </Button>
    </div>
  );
};

export default PeoplesList;
