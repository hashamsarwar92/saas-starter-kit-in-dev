

import { z } from "zod";
export type UserRole = "user" | "admin";


export interface User {
    id: string; // Clerk userId
    email: string;

    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;

    role: UserRole;
    isVerified: boolean; // Optional field to track if the user's email is verified
    isSubscribed: boolean; // Optional field to track if the user has an active subscription

    createdAt: Date;
    updatedAt: Date;
}
