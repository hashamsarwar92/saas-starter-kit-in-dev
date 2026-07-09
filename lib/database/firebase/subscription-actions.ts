import { db } from "@/lib/database/firebase/firebase-admin";
import { Subscription } from "@/lib/database/models/Subscription";
import { getSubscriptionRef } from "./collections";


export const SubscriptionActions = () => {

    const subscriptionsRef = getSubscriptionRef();


    return {

        async createSubscription(
            subscription: Omit<Subscription, "createdAt" | "updatedAt">
        ) {

            if (!subscription.id || subscription.id.trim() === "") {
                throw new Error(
                    "Subscription ID is required and cannot be empty"
                );
            }


            const ref = subscriptionsRef.doc(subscription.id);


            const existing = await ref.get();


            if (existing.exists) {
                await ref.update({
                    ...subscription,
                    updatedAt: new Date(),
                });

                return;
            }


            await ref.set({
                ...subscription,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },



        async getSubscriptionById(
            id: string
        ): Promise<Subscription | null> {

            const ref = subscriptionsRef.doc(id);

            const doc = await ref.get();


            if (!doc.exists) {
                return null;
            }


            const data = doc.data() as any;


            return {
                ...data,
                createdAt: data.createdAt?.toDate?.(),
                updatedAt: data.updatedAt?.toDate?.(),

                currentPeriodStart:
                    data.currentPeriodStart?.toDate?.(),

                currentPeriodEnd:
                    data.currentPeriodEnd?.toDate?.(),

            } as Subscription;
        },



        async getSubscriptionByUserId(
            uid: string
        ): Promise<Subscription | null> {

            const snapshot = await subscriptionsRef
                .where("uid", "==", uid)
                .limit(1)
                .get();


            if (snapshot.empty) {
                return null;
            }


            const doc = snapshot.docs[0];

            const data = doc.data() as any;


            return {
                ...data,
                id: doc.id,

                createdAt:
                    data.createdAt?.toDate?.(),

                updatedAt:
                    data.updatedAt?.toDate?.(),

                currentPeriodStart:
                    data.currentPeriodStart?.toDate?.(),

                currentPeriodEnd:
                    data.currentPeriodEnd?.toDate?.(),

            } as Subscription;
        },



        async updateSubscription(
            id: string,
            updates: Partial<
                Omit<
                    Subscription,
                    "id" | "createdAt" | "updatedAt"
                >
            >
        ) {

            if (Object.keys(updates).length === 0) {
                return;
            }


            const ref = subscriptionsRef.doc(id);


            await ref.update({
                ...updates,
                updatedAt: new Date(),
            });
        },



        async deleteSubscription(
            id: string
        ) {

            const ref = subscriptionsRef.doc(id);

            await ref.delete();
        },



        async deleteSubscriptionByUserId(
            uid: string
        ) {

            const snapshot = await subscriptionsRef
                .where("uid", "==", uid)
                .get();


            const batch = db.batch();


            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });


            await batch.commit();
        },


    };
};