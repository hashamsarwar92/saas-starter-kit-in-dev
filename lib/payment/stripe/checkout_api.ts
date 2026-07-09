
import { stripe } from "@/lib/payment/stripe/stripe";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function checkoutApi(req: Request) {

    /**
             * 1. Get authenticated user
             */
    const { userId } = await auth();

    if (!userId) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Get the priceId from the request body
    const { priceId } = await req.json();

    // Get the origin of the request to construct success and cancel URLs
    const appOrigin = new URL(req.url).origin;

    if (!priceId) {
        return Response.json(
            { error: "Missing priceId" },
            { status: 400 }
        );
    }


    const client = await clerkClient();
    const user = await client.users.getUser(userId);


    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
        return Response.json(
            { error: "No email found for user" },
            { status: 400 }
        );
    }

    /**
     * 2. Get or create Stripe customer
     */
    const customer = await stripe.customers.create({
        email,
        metadata: {
            userId,
        },
    });

    /**
     * 3. Create checkout session (IMPORTANT FIX)
     */
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",

        customer: customer.id, // ✅ CRITICAL FIX

        payment_method_types: ["card"],

        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],

        success_url: `${appOrigin}/checkout?status=success`,
        cancel_url: `${appOrigin}/checkout?status=failed`,

        metadata: {
            userId, // optional but very useful
        },
    });

    return Response.json({ url: session.url });
}