"use client";

import { Button } from "@/lib/auth/ui";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "./components/Navbar";


export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      <Navbar />

      {/* Soft Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-bold">
            N
          </div>

          <span className="font-semibold text-lg">Nova</span>
        </div>

        {isSignedIn && (
          <Button
            onClick={() => router.push("/dashboard")}
            className="
              rounded-lg
              bg-blue-600
              px-5 py-2.5
              text-white
              text-sm
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Dashboard
          </Button>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-7">
          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-100
            bg-blue-50
            px-4 py-1.5
            text-xs
            font-medium
            text-blue-700
          "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Secure platform
          </div>

          <h1
            className="
            text-4xl
            sm:text-5xl
            font-semibold
            tracking-tight
            leading-tight
          "
          >
            Simple tools.
            <br />
            Powerful workflow.
          </h1>

          <p
            className="
            mx-auto
            max-w-lg
            text-base
            text-slate-500
            leading-relaxed
          "
          >
            Manage your projects, access insights, and stay productive with a
            secure modern workspace.
          </p>

          {!isSignedIn && (
            <div className="flex justify-center gap-3 pt-3">
              <Button
                onClick={() => router.push("/sign-up")}
                className="
                  rounded-lg
                  bg-black
                  px-7 py-3
                  text-white
                  text-sm
                  font-medium
                  hover:bg-slate-800
                  transition
                "
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/sign-in")}
                className="
                  rounded-lg
                  border-slate-300
                  px-7 py-3
                  text-sm
                  font-medium
                  hover:bg-slate-50
                  transition
                "
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Minimal Feature Row */}
          <div
            className="
            grid
            grid-cols-3
            gap-3
            pt-10
          "
          >
            {["Secure", "Fast", "Reliable"].map((item) => (
              <div
                key={item}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4 py-3
                  text-xs
                  text-slate-600
                  bg-white
                "
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
