import "server-only";

import { DatabaseInterface } from "@/lib/database/DatabaseInterface";
import { User } from "./models/User";
import { dbActions } from "./firebase/db-actions";

export default function DatabaseActions(): DatabaseInterface {

    const createUser = async (user: User) => {
        dbActions.createUser(user);
    }

    const getUserById = async (id: string): Promise<User | null> => {
        return dbActions.getUserById(id);
    }

    const updateUser = async (id: string, updates: Partial<User>) => {
        dbActions.updateUser(id, updates);
    }

    const deleteUser = async (id: string) => {
        dbActions.deleteUser(id);
    }

    const updateUserRole = async (id: string, role: "user" | "admin") => {
        dbActions.updateUserRole(id, role);
    }

    const updateUserVerificationStatus = async (id: string, isVerified: boolean) => {
        dbActions.updateUserVerificationStatus(id, isVerified);
    }

    const updateUserSubscriptionStatus = async (id: string, isSubscribed: boolean) => {
        dbActions.updateUserSubscriptionStatus(id, isSubscribed);
    }

    const updateUserSubscriptionPlan = async (id: string, subscriptionPlanId: string | null) => {
        dbActions.updateUserSubscriptionPlan(id, subscriptionPlanId);
    }

    const updateUserNextBillingDate = async (id: string, nextBillingDate: string | null) => {
        dbActions.updateUserNextBillingDate(id, nextBillingDate);
    }

    const updateUserStripeCustomerId = async (id: string, stripeCustomerId: string | null) => {
        dbActions.updateUserStripeCustomerId(id, stripeCustomerId);
    }

    

    return {
        createUser,
        getUserById,
        updateUser,
        deleteUser,
        updateUserRole,
        updateUserVerificationStatus,
        updateUserSubscriptionStatus,
        updateUserSubscriptionPlan,
        updateUserNextBillingDate,
        updateUserStripeCustomerId,
    };
}