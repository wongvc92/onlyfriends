import { CopyCheck, CopyIcon } from "lucide-react";
import WidthWrapper from "../common/width-wrapper";
import { LoginForm } from "./login-form";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";

const ACCOUNTs = [
  { id: 1, email: "pikachu@pokemon.com", password: "pikachu" },
  { id: 2, email: "charmander@pokemon.com", password: "charmander" },
  { id: 3, email: "naruto@naruto.com", password: "naruto" },
  { id: 4, email: "sasuke@naruto.com", password: "sasuke" },
] as const;

const LoginPage = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipBoard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
  };
  return (
    <WidthWrapper>
      <div className="max-w-3xl mx-auto px-4 pt-10">
        <div className="flex flex-col gap-10 xl:flex-row">
          <div className="space-y-4 xl:w-1/2">
            <div className="text-center font-bold">Welcome to onlyfriends</div>
            <LoginForm />
          </div>
          <div className="space-y-4 pb-10 text-xs xl:w-1/2">
            <h4 className="text-center">Account to try</h4>
            <div className="border rounded-md w-full p-4 space-y-4">
              {ACCOUNTs.map((acc) => (
                <div key={acc.id} className="bg-muted rounded-md p-2 space-y-2">
                  <div className="flex items-center gap-2 justify-between">
                    <p>
                      <span className="font-semibold">Email:</span> {acc.email}
                    </p>
                    <Button onClick={() => copyToClipBoard(acc.email, `email-${acc.id}`)} type="button" variant="outline" size="icon">
                      {copiedField === `email-${acc.id}` ? <CopyCheck /> : <CopyIcon />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 justify-between">
                    <p>
                      <span className="font-semibold">Password:</span> {acc.password}
                    </p>
                    <Button onClick={() => copyToClipBoard(acc.password, `password-${acc.password}`)} type="button" variant="outline" size="icon">
                      {copiedField === `password-${acc.password}` ? <CopyCheck /> : <CopyIcon />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WidthWrapper>
  );
};

export default LoginPage;
