
import { User } from "@/dep/types";

export const UserActions = (ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>) => {
    const createUser = async (user: Omit<User, "createdAt" | "updatedAt">) => {
        if (!user.id || user.id.trim() === "") {
            throw new Error("User ID is required and cannot be empty");
        }

        const userRef = ref.doc(user.id);

        const existing = await userRef.get();
        if (existing.exists) {
            await userRef.update({
                ...user,
                updatedAt: new Date(),
            });
            return;
        }

        await userRef.set({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    const updateUser = async (id: string, updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>) => {
        if (Object.keys(updates).length === 0) return;
        const userRef = ref.doc(id);
        await userRef.update({
            ...updates,
            updatedAt: new Date(),
        });
    }

    const getUser = async (id: string): Promise<User | null> => {
        const userRef = ref.doc(id);
        const doc = await userRef.get();
        const data = doc.data() as any;
        if (!doc.exists) return null;

        return {
            ...data,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
        } as User;
    }

    const deleteUser = async (id: string) => {
        const userRef = ref.doc(id);
        await userRef.delete();
    }

    return {
        createUser,
        updateUser,
        getUser,
        deleteUser,
    }
}