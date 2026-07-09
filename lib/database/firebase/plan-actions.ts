import { db } from "@/lib/database/firebase/firebase-admin";
import { Plan } from "@/lib/database/models/Plan";
import { getPlanRef } from "./collections";


export const PlanActions = () => {

    const plansRef = getPlanRef();


    return {

        async createPlan(
            plan: Omit<Plan, "createdAt" | "updatedAt">
        ) {

            if (!plan.id || plan.id.trim() === "") {
                throw new Error(
                    "Plan ID is required and cannot be empty"
                );
            }


            const ref = plansRef.doc(plan.id);


            const existing = await ref.get();


            if (existing.exists) {

                await ref.update({
                    ...plan,
                    updatedAt: new Date(),
                });

                return;
            }


            await ref.set({
                ...plan,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },
        async getPlanById(
            id: string
        ): Promise<Plan | null> {

            const ref = plansRef.doc(id);

            const doc = await ref.get();


            if (!doc.exists) {
                return null;
            }


            const data = doc.data() as any;


            return {
                ...data,

                createdAt:
                    data.createdAt?.toDate?.(),

                updatedAt:
                    data.updatedAt?.toDate?.(),

            } as Plan;
        },
        async getPlanByStripePriceId(
            stripePriceId: string
        ): Promise<Plan | null> {

            const snapshot = await plansRef
                .where(
                    "stripePriceId",
                    "==",
                    stripePriceId
                )
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

            } as Plan;
        },
        async getAllPlans(): Promise<Plan[]> {

            const snapshot = await plansRef
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
        },
        async updatePlan(
            id: string,
            updates: Partial<
                Omit<
                    Plan,
                    "id" | "createdAt" | "updatedAt"
                >
            >
        ) {

            if (Object.keys(updates).length === 0) {
                return;
            }


            const ref = plansRef.doc(id);


            await ref.update({
                ...updates,
                updatedAt: new Date(),
            });
        },
        async deletePlan(
            id: string
        ) {

            const ref = plansRef.doc(id);

            await ref.delete();
        },
        async deactivatePlan(
            id: string
        ) {

            const ref = plansRef.doc(id);


            await ref.update({
                isActive: false,
                updatedAt: new Date(),
            });
        },


    };
};