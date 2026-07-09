
import { PlanType, IntervalType } from "../types";
export interface Plan {

  id: string; // Firestore document ID

  // Basic info
  name: string;
  type: PlanType;
  description?: string;


  // Stripe
  stripeProductId: string;
  stripePriceId: string;


  // Pricing
  amount: number; // smallest currency unit (2999 = $29.99)
  currency: string;
  interval: IntervalType;


  // Features
  features: string[];


  // Limits (for SaaS permissions)
  limits: {
    projects?: number;
    users?: number;
    storage?: number; // MB
    apiRequests?: number;
  };


  // Status
  isActive: boolean;
  isPopular?: boolean;


  createdAt: Date;
  updatedAt: Date;
}