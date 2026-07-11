import stripeWebhook from "@/lib/payment/stripe/stripe_webhook";


export async function POST(req: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    await stripeWebhook(secret!, req);

}