import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { repository } from "@/lib/database/repository";
import { IntervalType, PlanType, StatusType } from "@/lib/database/types";
import { Subscription } from "@/lib/database/models/Subscription";

export const runtime = "nodejs";

export default async function StripeWebhook(secret: string, req: Request) {
    const signature = req.headers.get("stripe-signature");
    if (!signature || !secret) {
        return Response.json(
            { error: "Missing signature or secret" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        const rawBody = await req.text();
        event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
        console.error("Error verifying webhook signature:", err);
        return Response.json({ error: "Invalid signature" }, { status: 400 });
    }


    try {
        switch (event.type) {

            /**
             * -------------------------
             * SUBSCRIPTION CREATED / PAID
             * -------------------------
             */
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.payment_status !== "paid") {
                    console.log("Checkout session not paid, ignoring");
                    break;
                }

                const customerId = session.customer as string | null;
                const subscriptionId = session.subscription as string | null;

                if (!customerId || !subscriptionId) {
                    throw new Error("Missing customer or subscription");
                }

                // 1. Fetch the full subscription details from Stripe to get dates & pricing
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // 2. Fetch the Stripe customer to get the Clerk userId stored in metadata
                const stripeCustomer = await stripe.customers.retrieve(customerId);
                const clerkUserId = (stripeCustomer as Stripe.Customer).metadata.userId;

                if (!clerkUserId) {
                    throw new Error(`No Clerk userId found in Stripe metadata for customer: ${customerId}`);
                }

                // 3. Extract item info for currency, amount, and plan types
                const lineItem = subscription.items.data[0];
                const price = lineItem.price;

                const subscriptionData: Omit<Subscription, "id" | "createdAt" | "updatedAt"> = {
                    uid: clerkUserId,
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscriptionId,
                    stripePriceId: price.id,

                    // 1. Map PlanType: Read from your Stripe Price Metadata (e.g., you set planType: "pro" in Stripe Dashboard)
                    plan: (price.metadata.planType || "pro") as PlanType,

                    // 2. Map StatusType: Direct cast since Stripe statuses ("active", "past_due", etc.) match your type literal perfectly
                    status: subscription.status as StatusType,

                    // 3. Map IntervalType: Cast the recurring interval ("month" | "year")
                    interval: (price.recurring?.interval || "month") as IntervalType,

                    // Timestamps from line items (Stripe 2025+ Basil spec)
                    currentPeriodStart: new Date(lineItem.current_period_start * 1000),
                    currentPeriodEnd: new Date(lineItem.current_period_end * 1000),
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,

                    currency: subscription.currency,
                    amount: price.unit_amount ? price.unit_amount / 100 : 0,
                    isSubscribed: true,
                };



                await repository().createSubscription(subscriptionData);

                const client = await clerkClient();
                await client.users.updateUser(clerkUserId, {
                    publicMetadata: {
                        isSubscribed: true,
                    },
                });

                break;
            }

            /**
             * -------------------------
             * RENEWAL PAYMENT SUCCESS
             * -------------------------
             */
            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;

                const customerId = invoice.customer as string | null;

                if (!customerId) throw new Error("Missing customer in invoice");

                await repository().updateSubscription(customerId, {
                    isSubscribed: true,
                })


                // 🔥 Clerk sync
                const customer = await stripe.customers.retrieve(customerId);
                const userId = (customer as Stripe.Customer).metadata.userId;
                const client = await clerkClient();
                await client.users.updateUser(userId, {
                    publicMetadata: {
                        isSubscribed: true,
                    },
                });

                break;
            }

            /**
             * -------------------------
             * PAYMENT FAILED
             * -------------------------
             */
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;

                const customerId = invoice.customer as string | null;

                if (customerId) {
                    await repository().updateSubscription(customerId, {
                        isSubscribed: false,
                    });

                }



                break;
            }

            /**
             * -------------------------
             * PAYMENT INTENTS (LOG ONLY)
             * -------------------------
             */
            case "payment_intent.succeeded":
            case "payment_intent.payment_failed": {
                const pi = event.data.object as Stripe.PaymentIntent;



                break;
            }

            /**
             * -------------------------
             * DEFAULT
             * -------------------------
             */
            default:
                console.log("Unhandled event type:", event.type, event.data);
                break;
        }



        return Response.json({ received: true });
    } catch (err) {


        /**
         * IMPORTANT:
         * Returning 500 makes Stripe retry safely
         */
        return Response.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}