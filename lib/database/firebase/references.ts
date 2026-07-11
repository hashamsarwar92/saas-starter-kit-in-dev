import { db } from "./firebase-admin";

export const collections = {
    users: "test_users",
    subscriptions: "test_subscriptions",
    plans: "test_plans",
} as const;

export const userRef = ()=>{
    return db.collection(collections.users);
}

export const subscriptionRef = () => {
    return db.collection(collections.subscriptions);
};

export const planRef = () => {
    return db.collection(collections.plans);
};

