import { getPeoples } from "@/data/getPeoples";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./ui/spinner";
import { Button } from "./ui/button";
import AddFriendButton from "./add-friend-button";
import UnfriendButton from "./unfriend-button";

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
          <div key={people.id} className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <img src="https://github.com/shadcn.png" alt={`${people.username}-image`} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold">{people.name}</p>
                <p className="font-light text-muted-foreground">@{people.username}</p>
              </div>
            </div>
            {people.friendship_status === "pending" ? <UnfriendButton peopleId={people.id} /> : <AddFriendButton peopleId={people.id} />}
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
