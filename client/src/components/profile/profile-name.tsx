import { cn } from "@/lib/utils";

interface ProfileNameProps {
  name: string;
  classname?: string;
}

const ProfileName = ({ name, classname }: ProfileNameProps) => {
  return <p className={cn("text-xs font-semibold", classname)}>{name}</p>;
};

export default ProfileName;
