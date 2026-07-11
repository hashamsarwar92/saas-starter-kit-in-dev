

export interface Plan {

    id: string; // Firestore document ID

    // Basic info
    name: string;
    type: string;
    description?: string;

    // Stripe
    stripeProductId: string;
    stripePriceId: string;

    // Pricing
    amount: number; // smallest currency unit (2999 = $29.99)
    currency: string;
    interval: string;

    // Features
    features: string[];

    // Status
    isActive: boolean;
    isPopular?: boolean;

    createdAt: Date;
    updatedAt: Date;
}