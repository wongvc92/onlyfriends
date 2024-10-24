import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const LogoutButton = () => {
  const navigate = useNavigate({ from: "/login" });
  const logoutUser = async () => {
    const url = new URL("http://localhost:5001/api/logout");

    const res = await fetch(url, {
      method: "POST",
    });

    if (!res.ok) {
      const errRes = await res.json();
      return errRes;
    }
    const succRes = await res.json();
    return succRes;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      toast({
        variant: "default",
        description: data.message || "Successfully logout",
      });
      navigate({ to: "/" });
    },

    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
      return;
    },
  });

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <Button type="button" onClick={onSubmit} disabled={isPending}>
      Logout
    </Button>
  );
};

export default LogoutButton;
