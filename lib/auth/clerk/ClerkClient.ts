"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn, useAuth, useUser } from "@clerk/nextjs";
import { SignUpSchemaType, CodeSchemaType, EmailSchemaType, PasswordResetSchemaType, SignInSchemaType } from "@/lib/auth/schemas";


export default function createClerkClientService() {
    const router = useRouter();
    const { signUp: clerkSignUp } = useSignUp();
    const { signIn: clerkSignIn } = useSignIn();
    const { signOut } = useAuth();
    const { user, isLoaded, isSignedIn } = useUser();


    const signUpWithGoogle = async (successRoute: string) => {
        if (!clerkSignUp) {
            throw new Error("Clerk sign-up instance is not available.");
        }

        await clerkSignUp.sso({
            strategy: "oauth_google",
            redirectCallbackUrl: "/sso-callback", // Where Clerk processes the OAuth tokens
            redirectUrl: successRoute,           // Where to send them on complete success
        });
    };

    const signInWithGoogle = async (successRoute: string) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }

        await clerkSignIn.sso({
            strategy: "oauth_google",
            redirectCallbackUrl: "/sso-callback", // Where Clerk processes the OAuth tokens
            redirectUrl: successRoute,           // Where to send them on complete success
        });
    };

    const getUserData = () => {
        if (!isLoaded) {
            throw new Error("Clerk is still loading user state.");
        }

        if (!isSignedIn || !user) {
            throw new Error("User is not authenticated.");
        }

        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
        };
    };

    const signUp = async (data: SignUpSchemaType) => {
        if (!clerkSignUp) {
            throw new Error("Clerk sign-up instance is not available.");
        }
        const { error } = await clerkSignUp.create({
            emailAddress: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
        });

        if (error) {
            throw new Error(error.message);
        }
    }

    const sendEmailVerificationCode = async (data: EmailSchemaType) => {
        if (!clerkSignUp) {
            throw new Error("Clerk sign-up instance is not available.");
        }
        await clerkSignUp.verifications.sendEmailCode();
    }

    const verifyEmailCode = async (data: CodeSchemaType) => {
        if (!clerkSignUp) {
            throw new Error("Clerk sign-up instance is not available.");
        }
        await clerkSignUp.verifications.verifyEmailCode({ code: data.code });
    }

    const signUpSuccess = async (route: string) => {
        if (!clerkSignUp) {
            throw new Error("Clerk sign-up instance is not available.");
        }
        if (clerkSignUp.status === "complete") {
            // ✅ v7: use signUp.finalize() instead of setActive()
            await clerkSignUp.finalize({
                navigate: ({ decorateUrl }) => {
                    const url = decorateUrl(route);
                    if (url.startsWith("http")) {
                        window.location.href = url;
                    } else {
                        router.push(url);
                    }
                },
            });
        } else {
            throw new Error("Sign-up process is not complete. Please try again.");
        }
    }



    const signIn = async (data: SignInSchemaType) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        const { error } = await clerkSignIn.create({
            identifier: data.email,
            password: data.password,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    const signInSuccess = async (route: string) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        if (clerkSignIn.status === "complete") {
            // ✅ v7: use signIn.finalize() instead of setActive()
            await clerkSignIn.finalize({
                navigate: ({ decorateUrl }) => {
                    const url = decorateUrl(route);
                    if (url.startsWith("http")) {
                        window.location.href = url;
                    } else {
                        router.push(url);
                    }
                },
            });
        } else {
            throw new Error("Sign-in process is not complete. Please try again.");
        }
    }



    const prepareEmail = async (data: EmailSchemaType) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        const { error } = await clerkSignIn.create({
            identifier: data.email,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    const sendPasswordResetEmailCode = async (data: EmailSchemaType) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        const { error } =
            await clerkSignIn.resetPasswordEmailCode.sendCode();
        if (error) {
            throw new Error(error.message);
        }
    }

    const verifyPasswordResetCode = async (data: CodeSchemaType) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        const { error } = await clerkSignIn.resetPasswordEmailCode.verifyCode({
            code: data.code,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    const resetPassword = async (data: PasswordResetSchemaType) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        const { error } = await clerkSignIn.resetPasswordEmailCode.submitPassword({
            password: data.password,
            signOutOfOtherSessions: true,
        });
        if (error) {
            throw new Error(error.message);
        }
    }

    const passwordResetSuccess = async (route: string) => {
        if (!clerkSignIn) {
            throw new Error("Clerk sign-in instance is not available.");
        }
        if (clerkSignIn.status === "complete") {
            await signOutUser(); // Sign out the user after password reset
            await clerkSignIn.finalize({
                navigate: ({ decorateUrl }) => {
                    const url = decorateUrl(route);
                    if (url.startsWith("http")) {
                        window.location.href = url;
                    } else {
                        router.push(url);
                    }
                },
            });
        }
    }

    const signOutUser = async () => {
        if (!signOut) {
            throw new Error("Clerk sign-out instance is not available.");
        }
        await signOut();
    }


    return {
        signUp,
        sendEmailVerificationCode,
        verifyEmailCode,
        signUpSuccess,
        signIn,
        signInSuccess,
        prepareEmail,
        sendPasswordResetEmailCode,
        verifyPasswordResetCode,
        resetPassword,
        passwordResetSuccess,
        signOutUser,
        getUserData,
        signUpWithGoogle,
        signInWithGoogle,
    }

}