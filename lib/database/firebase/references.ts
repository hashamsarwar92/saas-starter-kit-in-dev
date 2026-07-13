import { db } from "./firebase-admin";

// export const collections = {
//     users: "test_users",
//     subscriptions: "test_subscriptions",
//     plans: "test_plans",
// } as const;

export const userRef = ()=>{
    const userRef = db.collection(`${process.env.DATABASE_ACCESS_KEY}/users/users-collection`);
    return userRef;
}

export const subscriptionRef = () => {
    const subscriptionRef = db.collection(`${process.env.DATABASE_ACCESS_KEY}/subscriptions/subscriptions-collection`);
    return subscriptionRef;
}
export const planRef = () => {
    const planRef = db.collection(`${process.env.DATABASE_ACCESS_KEY}/plans/plans-collection`);
    return planRef;
};

