import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, TSignInSchema } from "@/validation/signInSchema";
import { Link, useSearch } from "@tanstack/react-router";
import { useLogin } from "@/hooks/auth/useLogin";
import SubmitButton from "../common/submit-button";

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const { showTwoFactor } = useSearch({ from: "/login" });
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const isShowTwoFactorToken = showTwoFactor === "true";
  return (
    <div className="flex flex-col space-y-4">
      {/* <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () =>
          await signIn("google", {
            callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
          })
        }
      >
        <FaGoogle /> Sign in with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () =>
          await signIn("facebook", {
            callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
          })
        }
      >
        <FaFacebookF /> Sign in with Facebook
      </Button> */}
      {/* <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or login with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => mutate(form.getValues()))} className="space-y-4">
          {isShowTwoFactorToken && (
            <FormField
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Two Factor Code</FormLabel>
                  <FormControl>
                    <Input type="code" {...field} placeholder="123456" disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {!isShowTwoFactorToken && (
            <>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isPending} />
                    </FormControl>
                    {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>
                    <Button variant="link" size="sm" asChild className="px-0" type="button" disabled={isPending}>
                      <Link to="/reset" className="mt-10">
                        Forgot password?
                      </Link>
                    </Button>
                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          <SubmitButton
            hideTitle={false}
            defaultTitle={isShowTwoFactorToken ? "Confirm" : "Login"}
            isLoading={isPending}
            isLoadingTitle={isShowTwoFactorToken ? "Confirming" : "Logging in"}
            className="w-full"
          />
        </form>
      </Form>

      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Do not have an account?{" "}
        <Link to="/register" className="font-bold">
          Register
        </Link>
      </p>
    </div>
  );
};
