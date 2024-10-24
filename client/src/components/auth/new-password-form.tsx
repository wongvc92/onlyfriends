import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPasswordSchema, TNewPasswordSchema } from "@/validation/newPasswordSchema";

const NewPasswordForm = () => {
  //   const token = searchParams.get("token");
  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = () => {};

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Enter a new password</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
