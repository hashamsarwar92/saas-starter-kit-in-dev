import { db } from "./firebase-admin";

export const collections = {
    users: "test_users",
    subscriptions: "test_subscriptions",
    plans: "test_plans",
} as const;

export const getUserRef = ()=>{
    return db.collection(collections.users);
}

export const getSubscriptionRef = () => {
    return db.collection(collections.subscriptions);
};

export const getPlanRef = () => {
    return db.collection(collections.plans);
};

