
import { PlanType, StatusType, IntervalType } from "../types";

export interface Subscription {
  id: string; // Firestore document ID

  // Clerk
  uid: string; // Clerk userId

  // Stripe
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;

  // Plan details
  plan: PlanType;
  status: StatusType;

  // Billing cycle
  interval: IntervalType;

  currentPeriodStart: Date;
  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  // Payment info
  currency: string;
  amount: number;

  // Clerk metadata sync
  isSubscribed: boolean;

  createdAt: Date;
  updatedAt: Date;
}