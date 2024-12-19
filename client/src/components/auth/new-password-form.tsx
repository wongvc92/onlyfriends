import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPasswordSchema, TNewPasswordSchema } from "@/validation/newPasswordSchema";
import { useNavigate, useSearch } from "@tanstack/react-router";
import useNewPassword from "@/hooks/auth/useNewPassword";
import { useEffect } from "react";
import SubmitButton from "../common/submit-button";

const NewPasswordForm = () => {
  const { token } = useSearch({ from: "/(auth)/new-password/" });
  const { mutate, isPending } = useNewPassword();
  const navigate = useNavigate({ from: "/new-password" });

  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
    },
  });

  useEffect(() => {
    if (token) {
      form.reset({ token });
    }
  }, [token, form]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    mutate({ ...form.getValues() }, { onSuccess: () => navigate({ to: "/login" }) });
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Enter a new password</p>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                {form.formState.errors.confirmPassword && <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={isPending}
            defaultTitle="Register new password"
            isLoadingTitle="Registering..."
            hideTitle={false}
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
