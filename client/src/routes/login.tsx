import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema, TSignInSchema } from "@/validation/signInSchema";
import { Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = "/home" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),

  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const loginUser = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: form.getValues().code, email: form.getValues().email, password: form.getValues().password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log("errorData", errorData);
      toast.error(errorData.message);
      return errorData;
    }
    const data = await res.json();

    if (data.twoFactor === true) {
      setShowTwoFactor(true);
      toast.success("Please check email for two factor code");
    }

    window.location.href = "/home";
    console.log("data login", data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = async () => {
    mutate();
  };

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
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or login with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {showTwoFactor && (
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
          {!showTwoFactor && (
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
                      <a href="/auth/reset" className="mt-10">
                        Forgot password?
                      </a>
                    </Button>
                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Sign in"}
          </Button>
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
}
