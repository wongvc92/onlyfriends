import { Button } from "../ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { useLogout } from "@/hooks/auth/useLogout";

const LogoutButton = () => {
  const { mutate, isPending } = useLogout();
  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <Button type="button" onClick={onSubmit} disabled={isPending} className="w-fit rounded-full" variant="secondary">
      <MdOutlineLogout /> <span className="hidden lg:block">Logout</span>
    </Button>
  );
};

export default LogoutButton;
