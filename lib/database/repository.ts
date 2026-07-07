
import "server-only";
import { UserActions } from "./firebase/user-actions";
import { User } from "./models/User";

export interface Repository {
  createUser: (user: Omit<User, "createdAt" | "updatedAt">) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

// 🔒 Singleton instance (module scoped)
let repo: Repository | null = null;

export const repository = (): Repository => {
  if (repo) {
    return repo; // ✅ return cached instance
  }

  const userActions = UserActions();

  repo = {
    createUser: userActions.createUser,
    getUserById: userActions.getUserById,
    updateUser: userActions.updateUser,
    deleteUser: userActions.deleteUser,
  };

  return repo;
};

