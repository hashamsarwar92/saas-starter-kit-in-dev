import { stripe } from "@/lib/payment/stripe/stripe";

export default async function StripeCheckoutSession(userId: string, email: string, priceId: string, baseUrl: string) {
    const stripeCustomer = await stripe.customers.create({
        email,
        metadata: {
            userId,
        }
    });

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: stripeCustomer.id,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${baseUrl}/checkout?status=success`,
        cancel_url: `${baseUrl}/checkout?status=failed`,
        metadata: {
            userId,
        },
    })
    return Response.json({ url: session.url });
}