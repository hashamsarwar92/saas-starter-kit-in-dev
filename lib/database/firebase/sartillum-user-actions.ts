"use server";
import { db } from "@/lib/database/firebase/firebase-admin";
import { User } from "@/lib/database/models/User";
import { getSartillumUserRef } from "./collections";



export const SartillumUserActions = () => {

    const usersRef = getSartillumUserRef();

    return {
        async createUser(user: Omit<User, "createdAt" | "updatedAt">) {
            if (!user.id || user.id.trim() === "") {
                throw new Error("User ID is required and cannot be empty");
            }

            const ref = usersRef.doc(user.id);

            const existing = await ref.get();
            if (existing.exists) {
                // Optional: update instead of overwrite
                await ref.update({
                    ...user,
                    updatedAt: new Date(),
                });
                return;
            }

            await ref.set({
                ...user,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        },

        async getUserById(id: string): Promise<User | null> {
            const ref = usersRef.doc(id);
            const doc = await ref.get();
            const data = doc.data() as any;
            if (!doc.exists) return null;

            return {
                ...data,
                createdAt: data.createdAt?.toDate?.(),
                updatedAt: data.updatedAt?.toDate?.(),
            } as User;
        },

        async updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) {
            if (Object.keys(updates).length === 0) return;
            const ref = usersRef.doc(id);
            await ref.update({
                ...updates,
                updatedAt: new Date(),
            });
        },

        async deleteUser(id: string) {
            const ref = usersRef.doc(id);
            await ref.delete();
        },


    }
}