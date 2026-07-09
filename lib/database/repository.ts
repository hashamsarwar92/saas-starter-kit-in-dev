
import "server-only";
import { UserActions } from "./firebase/user-actions";
import { PlanActions } from "./firebase/plan-actions";
import { SubscriptionActions } from "./firebase/subscription-actions";
import { User } from "./models/User";
import { Plan } from "./models/Plan";
import { Subscription } from "./models/Subscription";

export interface Repository {
  createUser: (user: Omit<User, "createdAt" | "updatedAt">) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (
    id: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  createPlan: (plan: Omit<Plan, "createdAt" | "updatedAt">) => Promise<void>;
  getPlanById: (id: string) => Promise<Plan | null>;
  getPlanByStripePriceId: (stripePriceId: string) => Promise<Plan | null>;
  getAllPlans: () => Promise<Plan[]>;
  updatePlan: (
    id: string,
    updates: Partial<Omit<Plan, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  deactivatePlan: (id: string) => Promise<void>;

  createSubscription: (
    subscription: Omit<Subscription,  "createdAt" | "updatedAt">
  ) => Promise<void>;
  getSubscriptionById: (id: string) => Promise<Subscription | null>;
  updateSubscription: (
    id: string,
    updates: Partial<Omit<Subscription, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscriptionByUserId: (uid: string) => Promise<Subscription | null>;
}

// 🔒 Singleton instance (module scoped)
let repo: Repository | null = null;

export const repository = (): Repository => {
  if (repo) {
    return repo; // ✅ return cached instance
  }

  const userActions = UserActions();
  const planActions = PlanActions();
  const subscriptionActions = SubscriptionActions();

  repo = {
    createUser: userActions.createUser,
    getUserById: userActions.getUserById,
    updateUser: userActions.updateUser,
    deleteUser: userActions.deleteUser,
    createPlan: planActions.createPlan,
    getPlanById: planActions.getPlanById,
    getPlanByStripePriceId: planActions.getPlanByStripePriceId,
    getAllPlans: planActions.getAllPlans,
    updatePlan: planActions.updatePlan,
    deletePlan: planActions.deletePlan,
    deactivatePlan: planActions.deactivatePlan,
    createSubscription: subscriptionActions.createSubscription,
    getSubscriptionById: subscriptionActions.getSubscriptionById,
    updateSubscription: subscriptionActions.updateSubscription,
    deleteSubscription: subscriptionActions.deleteSubscription,
    getSubscriptionByUserId: subscriptionActions.getSubscriptionByUserId,

  };

  return repo;
};

