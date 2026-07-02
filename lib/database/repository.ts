
import "server-only";
import { SartillumUserActions } from "@/lib/database/firebase/sartillum-user-actions";
import { User } from "./models/User";

export interface Repository {
  createSartillumUser: (user: Omit<User, "createdAt" | "updatedAt">) => Promise<void>;
  getSartillumUserById: (id: string) => Promise<User | null>;
  updateSartillumUser: (
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteSartillumUser: (id: string) => Promise<void>;
}

// 🔒 Singleton instance (module scoped)
let repo: Repository | null = null;

export const repository = (): Repository => {
  if (repo) {
    return repo; // ✅ return cached instance
  }

  const sartillumUserActions = SartillumUserActions();

  repo = {
    createSartillumUser: sartillumUserActions.createUser,
    getSartillumUserById: sartillumUserActions.getUserById,
    updateSartillumUser: sartillumUserActions.updateUser,
    deleteSartillumUser: sartillumUserActions.deleteUser,
  };

  return repo;
};

