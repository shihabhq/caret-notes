"use client";

import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { useActionState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signUpAction } from "@/actions/users";

type AuthDetails = {
  errorMsg?: string;
  title?: string;
};

const AuthForm = ({ type }: { type: "login" | "signup" }) => {
  const isLoginForm = type === "login";
  const router = useRouter();
  const initialAuthState: AuthDetails = {};

  const handleSubmit = async (
    prevState: AuthDetails,
    formData: FormData,
  ): Promise<AuthDetails> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { errorMsg: "All fields are required" };
    }

    if (isLoginForm) {
      const result = await loginAction(email, password);
      if (result?.errorMessage) {
        return { errorMsg: result.errorMessage };
      } else {
        toast.success("Logged In successfully");
        router.replace("/");
        return {};
      }
    } else {
      const result = await signUpAction(email, password);
      if (result?.errorMessage) {
        return { errorMsg: result.errorMessage };
      } else {
        toast.success("Signed Up successfully -> check your email");
        router.replace("/");
        return {};
      }
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    initialAuthState,
  );

  return (
    <form action={formAction}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            disabled={isPending}
            required
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            disabled={isPending}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col">
        <Button className="w-full cursor-pointer">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Log In"
          ) : (
            "Sign up"
          )}
        </Button>
        <p className="mt-2">
          {isLoginForm ? "Don't Have an Accout?" : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/signup" : "/login"}
            className={`text-sky-400 underline ${isPending && "pointer-events-none opacity-50"}`}
          >
            {isLoginForm ? "Sign up" : "login"}
          </Link>
        </p>
      </CardFooter>
      {state?.errorMsg && <p className="px-2 text-red-600">{state.errorMsg}</p>}
    </form>
  );
};

export default AuthForm;
