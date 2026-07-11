import { Plan } from "@/dep/types";

export const PlanActions = (ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>) => {

    const getPlans = async (): Promise<Plan[]> => {

        const snapshot = await ref
            .where(
                "isActive",
                "==",
                true
            )
            .get();

        return snapshot.docs.map((doc) => {

            const data = doc.data() as any;

            return {
                ...data,
                id: doc.id,

                createdAt:
                    data.createdAt?.toDate?.(),

                updatedAt:
                    data.updatedAt?.toDate?.(),

            } as Plan;

        });
    }


    return {
        getPlans
    };
};