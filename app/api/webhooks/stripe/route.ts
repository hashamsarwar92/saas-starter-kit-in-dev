import StripeWebhook from "@/lib/payment/stripe/stripe-webhook";
import { repository } from "@/lib/database/repository";
export async function POST(req: Request) {
    try {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = req.headers.get("stripe-signature");
        const body = await req.text();
        if (!signature || !secret) {
            throw new Error("Missing signature or secret");
        }
        return StripeWebhook(signature!, body, secret!, repository());
    } catch (err) {
        console.error("Error verifying webhook signature:", err);
        return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

}