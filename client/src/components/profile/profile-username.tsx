import { cn } from "@/lib/utils";

interface ProfileUsernameProps {
  username: string;
  classname?: string;
}
const ProfileUsername = ({ username, classname }: ProfileUsernameProps) => {
  return <p className={cn("text-xs font-light text-muted-foreground", classname)}>@{username}</p>;
};

export default ProfileUsername;
