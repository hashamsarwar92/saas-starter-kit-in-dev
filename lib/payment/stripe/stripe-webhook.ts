import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe/stripe";
import { Subscription } from "@/lib/types";
import { Repository } from "@/lib/database/repository";


export default async function StripeWebhook(signature: string, body: string, secret: string, repo: Repository) {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    if (!event) {
        throw new Error("Invalid Stripe webhook event");
    }
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_status !== "paid") {
                throw new Error("Checkout session not paid");
            }
            const customerId = session.customer as string | null;
            const subscriptionId = session.subscription as string | null;
            if (!customerId || !subscriptionId) {
                throw new Error("Missing customer or subscription");
            }
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const stripeCustomer = await stripe.customers.retrieve(customerId);
            const clerkUserId = (stripeCustomer as Stripe.Customer).metadata.userId;
            if (!clerkUserId) {
                throw new Error(`No Clerk userId found in Stripe metadata for customer: ${customerId}`);
            }
            const lineItem = subscription.items.data[0];
            const price = lineItem.price;

            const subscriptionData: Omit<Subscription, "createdAt" | "updatedAt"> = {
                id: subscription.id,
                uid: clerkUserId,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: price.id,
                plan: (price.metadata.planType || "pro") as string,
                status: subscription.status as string,
                interval: (price.recurring?.interval || "month") as string,
                currentPeriodStart: new Date(lineItem.current_period_start * 1000),
                currentPeriodEnd: new Date(lineItem.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currency: subscription.currency,
                amount: price.unit_amount ? price.unit_amount / 100 : 0,
                isSubscribed: true,
            };
            await repo.createSubscription(subscriptionData);

            break;
        }
        case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = invoice.parent?.subscription_details?.subscription as string | null;
            if (!subscriptionId) throw new Error("Missing subscription in invoice");
            const stripeCustomerId = invoice.customer as string | null;
            if (!stripeCustomerId) throw new Error("Missing customer in invoice");
            const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
            const userId = (stripeCustomer as Stripe.Customer).metadata.userId;
            await repo.updateSubscriptionStatus(
                subscriptionId,
                userId,
                true
            );
            break;
        }
        case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = invoice.parent?.subscription_details?.subscription as string | null;
            if (!subscriptionId) throw new Error("Missing subscription in invoice");
            const stripeCustomerId = invoice.customer as string | null;
            if (!stripeCustomerId) throw new Error("Missing customer in invoice");
            const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
            const userId = (stripeCustomer as Stripe.Customer).metadata.userId;
            await repo.updateSubscriptionStatus(
                subscriptionId,
                userId,
                false
            );
            break;
        }
        case "payment_intent.succeeded": {
            break;
        }
        case "payment_intent.payment_failed": {
            break;
        }
        default: {
            console.log(`Unhandled event type: ${event.type}`);
        }
    }
    return Response.json({ received: true });
}