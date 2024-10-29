// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { signInSchema, TSignInSchema } from "@/validation/signInSchema";
// import { Link, useNavigate, useRouter } from "@tanstack/react-router";

// import { useAuth } from "@/auth";

// export const LoginForm = ({ search }) => {
//   const { loginUser, showTwoFactor, authState } = useAuth();

//   const navigate = useNavigate({ from: "/login" });
//   const router = useRouter();
//   const form = useForm<TSignInSchema>({
//     resolver: zodResolver(signInSchema),
//     mode: "all",
//     defaultValues: {
//       email: "",
//       password: "",
//       code: "",
//     },
//   });

//   const onSubmit = async () => {
//     await loginUser(form.getValues().code || "", form.getValues().email, form.getValues().password);

//     await router.invalidate();
//     await navigate({ to: search.redirect || fallback });
//   };

//   console.log("authState", authState);
//   return (
//     <div className="flex flex-col space-y-4 ">
//       {/* <Button
//         type="button"
//         variant="outline"
//         className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
//         onClick={async () =>
//           await signIn("google", {
//             callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
//           })
//         }
//       >
//         <FaGoogle /> Sign in with Google
//       </Button>
//       <Button
//         type="button"
//         variant="outline"
//         className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
//         onClick={async () =>
//           await signIn("facebook", {
//             callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
//           })
//         }
//       >
//         <FaFacebookF /> Sign in with Facebook
//       </Button> */}
//       <div className="flex items-center justify-center my-4">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="mx-4 text-muted-foreground text-xs"> Or login with email</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           {showTwoFactor && (
//             <FormField
//               name="code"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-muted-foreground">Two Factor Code</FormLabel>
//                   <FormControl>
//                     <Input type="code" {...field} placeholder="123456" disabled={authState.isLoading} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           )}
//           {!showTwoFactor && (
//             <>
//               <FormField
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-muted-foreground">Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" {...field} disabled={authState.isLoading} />
//                     </FormControl>
//                     {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-muted-foreground">Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" {...field} disabled={authState.isLoading} />
//                     </FormControl>
//                     <Button variant="link" size="sm" asChild className="px-0" type="button" disabled={authState.isLoading}>
//                       <a href="/auth/reset" className="mt-10">
//                         Forgot password?
//                       </a>
//                     </Button>
//                     {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
//                   </FormItem>
//                 )}
//               />
//             </>
//           )}

//           <Button type="submit" className="w-full" disabled={authState.isLoading}>
//             {showTwoFactor ? "Confirm" : "Sign in"}
//           </Button>
//         </form>
//       </Form>

//       <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
//         Do not have an account?{" "}
//         <Link to="/register" className="font-bold">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// };
