import { cn } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";

interface ProfileUsernameProps {
  username: string;
  classname?: string;
}
const ProfileUsername = ({ username, classname }: ProfileUsernameProps) => {
  const { username: paramsUsername } = useParams({ strict: false });
  return (
    <p className={cn("font-light text-muted-foreground", classname)}>
      @{username || paramsUsername}
    </p>
  );
};

export default ProfileUsername;
