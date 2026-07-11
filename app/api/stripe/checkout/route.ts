import StripeCheckoutSession from "@/lib/payment/stripe/stripe-checkout-api";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const email = user.emailAddresses?.[0]?.emailAddress;
        if (!email) {
            throw new Error("No email found for user");
        }

        const { priceId } = await req.json();
        if (!priceId) {
            throw new Error("Missing priceId");
        }

        const baseUrl = new URL(req.url).origin;

        return await StripeCheckoutSession(userId, email, priceId, baseUrl);

    } catch (error: unknown) {
        console.error("[Stripe Checkout Error]", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create Stripe Checkout session";

        return Response.json(
            { error: message },
            { status: 500 }
        );
    }
}