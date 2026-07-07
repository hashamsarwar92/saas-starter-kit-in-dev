"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInSchema,
  SignInSchemaType,
} from "@/lib/auth/schemas/SignInSchema";
import {
  Card,
  CardHeader,
  Input,
  Spacer,
  PasswordInput,
  Button,
  Separator,
  FormAlert,
} from "../ui";
import { SignUpSchemaType } from "../schemas";

const SignInForm = ({
  onSubmit,
  onSignInWithGoogle,
}: {
  onSubmit: (data: SignInSchemaType) => Promise<void>;
  onSignInWithGoogle: () => Promise<void>;
}) => {
  const router = useRouter();
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (data: SignInSchemaType) => {
    setAuthErrors(null);
    setIsSubmitting(true);
    console.log("Submitting sign in form with data:");
    try {
      await onSubmit({
        email: data.email,
        password: data.password,
      });
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthErrors(err.message);
      } else {
        setAuthErrors("An unexpected error occurred during sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await onSignInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthErrors(err.message);
      } else {
        setAuthErrors("An unexpected error occurred while signing in with Google.");
      }
    }
  };

  return (
    <Card className="bg-black border-gray-700 shadow-xl p-8 w-full max-w-md">
      <CardHeader
        title="Sign In"
        description="Sign in to your account"
        className="text-center mb-6"
      />
      <FormAlert message={authErrors} />
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div id="clerk-captcha" />
        <Spacer size="8px" />
        <Input
          type="email"
          label="Email"
          placeholder="Enter email"
          autoComplete="email"
          aria-describedby="email-error"
          {...register("email")}
          error={errors.email?.message}
        />
        <Spacer size="8px" />
        <PasswordInput
          id="password"
          label="Password"
          placeholder="Enter password"
          type="password"
          autoComplete="current-password"
          aria-describedby="password-error"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-end mt-2">
          <Button
            onClick={() => router.push("/forgot-password")}
            variant="link"
          >
            Forgot Password?
          </Button>
        </div>
        <Spacer size="24px" />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
        <Spacer size="12px" />
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSignInWithGoogle}
        >
          Sign In with Google
        </Button>
      </form>
      <div>
        <Spacer size="12px" />

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Separator />
          </div>

          <span className="text-sm text-gray-500 whitespace-nowrap">OR</span>

          <div className="flex-1">
            <Separator />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500">Don't have an account?</span>

        <Button onClick={()=>{router.replace('/sign-up')}} variant="link">Sign Up</Button>
      </div>
    </Card>
  );
};

export default SignInForm;
