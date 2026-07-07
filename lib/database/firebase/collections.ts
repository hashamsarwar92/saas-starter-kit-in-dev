import { db } from "./firebase-admin";

export const collections = {
    users: "sartillum_users",
    subscriptions: "sartillum_subscriptions",
    products: "sartillum_products",
} as const;

export const getUserRef = ()=>{
    return db.collection(collections.users);
}

