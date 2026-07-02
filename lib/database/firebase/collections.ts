import { db } from "./firebase-admin";

export const sartillum_collections = {
    users: "sartillum_users",
    subscriptions: "sartillum_subscriptions",
    products: "sartillum_products",
} as const;

export const getSartillumUserRef = ()=>{
    return db.collection(sartillum_collections.users);
}

