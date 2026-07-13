
import { Subscription } from "@/lib/types";



export const SubscriptionActions = (ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>) => {

    const createSubscription = async (
        subscription: Omit<Subscription, "createdAt" | "updatedAt">
    ) => {

        if (!subscription.id || subscription.id.trim() === "") {
            throw new Error(
                "Subscription ID is required and cannot be empty"
            );
        }


        const subscriptionsRef = ref.doc(subscription.id);


        const existing = await subscriptionsRef.get();


        if (existing.exists) {
            await subscriptionsRef.update({
                ...subscription,
                updatedAt: new Date(),
            });

            return;
        }


        await subscriptionsRef.set({
            ...subscription,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    const updateSubscription = async (
        id: string,
        updates: Partial<
            Omit<
                Subscription,
                "id" | "createdAt" | "updatedAt"
            >
        >
    ) => {

        if (Object.keys(updates).length === 0) {
            return;
        }


        const subscriptionsRef = ref.doc(id);


        await subscriptionsRef.update({
            ...updates,
            updatedAt: new Date(),
        });
    }

    const deleteSubscription = async (
        id: string
    ) => {

        const subscriptionsRef = ref.doc(id);

        await subscriptionsRef.delete();
    }

    const getSubscription = async (
        id: string
    ): Promise<Subscription | null> => {

        const subscriptionsRef = ref.doc(id);

        const doc = await subscriptionsRef.get();


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
    }

    const getSubscriptionsByUserId = async (uid: string): Promise<Subscription[]|null> => {

        const snapshot = await ref
            .where("uid", "==", uid)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map((doc) => {
            const data = doc.data() as any;

            return {
                ...data,
                id: doc.id,

                createdAt: data.createdAt?.toDate?.(),
                updatedAt: data.updatedAt?.toDate?.(),

                currentPeriodStart: data.currentPeriodStart?.toDate?.(),
                currentPeriodEnd: data.currentPeriodEnd?.toDate?.(),
            } as Subscription;
        });
    }

    return {
        createSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscription,
        getSubscriptionsByUserId,
    };
}