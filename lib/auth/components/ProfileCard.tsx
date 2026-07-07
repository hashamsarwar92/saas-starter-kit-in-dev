"use client";

import React from "react";
import createClerkClientService from "@/lib/auth/clerk/ClerkClient";

const ProfileCard = () => {
  const { getUserData } = createClerkClientService();

  let user;

  try {
    user = getUserData(); // 👈 this can throw
  } catch (e) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm p-3">
        
        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
          {user?.firstName?.[0] || "U"}
        </div>

        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;