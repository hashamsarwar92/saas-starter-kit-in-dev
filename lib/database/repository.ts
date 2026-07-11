
import { User, Plan, Subscription } from "@/lib/types";
import { UserActions, PlanActions, SubscriptionActions } from "@/lib/database/firebase/actions";
import { userRef, subscriptionRef, planRef } from "@/lib/database/firebase/references";
import { clerkClient } from "@clerk/nextjs/server";

export interface Repository {
    createUser: (user: Omit<User, "createdAt" | "updatedAt">) => Promise<void>;
    getUser: (id: string) => Promise<User | null>;
    updateUser: (
        id: string,
        updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
    ) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    getAllPlans: () => Promise<Plan[]>;
    createSubscription: (
        subscription: Omit<Subscription, "createdAt" | "updatedAt">
    ) => Promise<void>;
    getSubscription: (id: string) => Promise<Subscription | null>;
    updateSubscription: (
        id: string,
        updates: Partial<Omit<Subscription, "id" | "createdAt" | "updatedAt">>
    ) => Promise<void>;
    deleteSubscription: (id: string) => Promise<void>;
    getSubscriptionsByUserId: (uid: string) => Promise<Subscription[] | null>;
    updateSubscriptionStatus: (
        subId: string,
        uid: string,
        isSubscribed: boolean
    ) => Promise<void>;
}

let repo: Repository | null = null;

export const repository = (): Repository => {
    if (repo) {
        return repo; // ✅ return cached instance
    }


    const userActions = UserActions(userRef());
    const planActions = PlanActions(planRef());
    const subscriptionActions = SubscriptionActions(subscriptionRef());


    const createSubscription = async (
        subscription: Omit<Subscription, "createdAt" | "updatedAt">
    ) => {
        await subscriptionActions.createSubscription(subscription);
        await userActions.updateUser(subscription.uid, {
            isSubscribed: true,
        });
        const client = await clerkClient();
        await client.users.updateUser(subscription.uid, {
            publicMetadata: {
                isSubscribed: true,
            },
        });
    };

    const updateSubscriptionStatus = async (
        subId: string,
        uid: string,
        isSubscribed: boolean
    ) => {
        await subscriptionActions.updateSubscription(subId, {
            isSubscribed,
        });
        await userActions.updateUser(uid, {
            isSubscribed,
        });
        const client = await clerkClient();
        await client.users.updateUser(uid, {
            publicMetadata: {
                isSubscribed: isSubscribed,
            },
        });
    };


    repo = {
        createUser: userActions.createUser,
        getUser: userActions.getUser,
        updateUser: userActions.updateUser,
        deleteUser: userActions.deleteUser,
        getAllPlans: planActions.getPlans,
        createSubscription: createSubscription,
        getSubscription: subscriptionActions.getSubscription,
        updateSubscription: subscriptionActions.updateSubscription,
        deleteSubscription: subscriptionActions.deleteSubscription,
        getSubscriptionsByUserId: subscriptionActions.getSubscriptionsByUserId,
        updateSubscriptionStatus: updateSubscriptionStatus,

    };

    return repo;
};