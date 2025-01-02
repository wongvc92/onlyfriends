import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import WidthWrapper from "../common/width-wrapper";

const VerifyEmailPage = () => {
  const { token } = useSearch({ from: "/(auth)/verify-email/" });
  const { mutate, isPending } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [mutate, token]);

  if (isPending) {
    return <p>Verifying email...</p>;
  }
  return (
    <WidthWrapper>
      <div className="px-4 pt-10 max-w-md mx-auto h-screen">
        <h1>Email Verification</h1>
        <p>Your token is: {token}</p>
      </div>
    </WidthWrapper>
  );
};
export default VerifyEmailPage;
