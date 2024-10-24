import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TSignUpFormSchema } from "@/validation/registerSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

const RegisterForm = () => {
  const queryClient = useQueryClient();
  const form = useForm<TSignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "all",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerUser = async () => {
    const url = new URL("http://localhost:5001/api/register");

    const data = {
      username: form.getValues("username"),
      email: form.getValues("email"),
      password: form.getValues("password"),
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
    if (!res.ok) {
      const errRes = await res.json();
      return errRes;
    }
    const succRes = await res.json();
    return succRes;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast({
        variant: "default",
        description: data.message || "Successfully registered",
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["register"] });
    },

    onError: () => {
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
      return;
    },
  });

  const onSubmit = async () => {
    mutate();
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or register with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.username && <FormMessage>{form.formState.errors.username.message}</FormMessage>}
              </FormItem>
            )}
          />
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
                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.confirmPassword && <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Register
          </Button>
        </form>
      </Form>
      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Already have an account?
        <Link to="/login" className="font-bold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
