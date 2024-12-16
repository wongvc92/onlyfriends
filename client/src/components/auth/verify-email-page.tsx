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
      <h1>Email Verification</h1>
      <p>Your token is: {token}</p>
    </WidthWrapper>
  );
};
export default VerifyEmailPage;
