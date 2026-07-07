"use client";

import React, { useState } from "react";
import createClerkClientService from "@/lib/auth/clerk/ClerkClient";
import { Button } from "../ui";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  const { signOutUser } = createClerkClientService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);

      await signOutUser();
    } catch (err: any) {
      setError(err?.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleSignOut} disabled={loading}>
        <LogOut size={18} />

        {loading ? "Signing out..." : "Sign Out"}
      </Button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SignOutButton;
