"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignUpSchema,
  SignUpSchemaType,
} from "@/lib/auth/schemas/SignUpSchema";
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

const SignUpForm = ({
  onSubmit,
  onSignUpWithGoogle,
}: {
  onSubmit: (data: SignUpSchemaType) => Promise<void>;
  onSignUpWithGoogle: () => Promise<void>;
}) => {
  const router = useRouter();
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleOnSubmit = async (data: SignUpSchemaType) => {
    setAuthErrors(null);
    setIsSubmitting(true);
    console.log("Submitting sign up form with data:");
    try {
      await onSubmit({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthErrors(err.message);
      } else {
        setAuthErrors("An unexpected error occurred during sign up.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      await onSignUpWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthErrors(err.message);
      } else {
        setAuthErrors("An unexpected error occurred while signing up with Google.");
      }
    }
  }

  return (
    <Card className="bg-black border-gray-700 shadow-xl p-8 w-full max-w-md">
      <CardHeader
        title="Sign Up"
        description="Create a new account"
        className="text-center mb-6"
      />
      <FormAlert message={authErrors} />
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div id="clerk-captcha" />
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            autoComplete="given-name"
            aria-describedby="firstName-error"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            autoComplete="family-name"
            aria-describedby="lastName-error"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
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
          autoComplete="new-password"
          aria-describedby="password-error"
          {...register("password")}
          error={errors.password?.message}
        />
        <Spacer size="8px" />
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          autoComplete="new-password"
          aria-describedby="confirmPassword-error"
          {...register("passwordConfirmation")}
          error={errors.passwordConfirmation?.message}
        />
        <Spacer size="24px" />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
        <Spacer size="24px" />

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSignUpWithGoogle}
        >
          Sign Up with Google
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
        <span className="text-sm text-gray-500">Already have an account?</span>

        <Button onClick={()=>{router.replace('/sign-in')}} variant="link">Sign In</Button>
      </div>
    </Card>
  );
};

export default SignUpForm;
