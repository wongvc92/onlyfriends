import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetSignInSchema, TResetSignInSchema } from "@/validation/resetSignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ResetForm = () => {
  const form = useForm<TResetSignInSchema>({
    resolver: zodResolver(resetSignInSchema),
    mode: "all",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {};

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Forgot your password?</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetForm;
