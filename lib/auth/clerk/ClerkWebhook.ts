
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export default async function ClerkWebhook(request: Request) {
    
    const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!secret) {
        console.error("CLERK_WEBHOOK_SIGNING_SECRET is not set in environment variables.");
        return new Response("Server misconfigured", { status: 500 });
    }
    const h = await headers();

    const svix_id = h.get("svix-id");
    const svix_timestamp = h.get("svix-timestamp");
    const svix_signature = h.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing headers", { status: 400 });
    }

    let event: WebhookEvent;

    try {

        const body = await request.text();

        const webhook = new Webhook(secret);

        event = webhook.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;

    } catch (err) {
        console.error("Error verifying webhook signature:", err);
        return new Response("Invalid signature", { status: 400 });
    }

    try {
        switch (event.type) {

            /**
             * =========================
             * USER CREATED
             * =========================
             */
            case "user.created": {
                const user = event.data;

                const email = user.email_addresses?.[0]?.email_address;

                if (!email) {
                    throw new Error("Missing email in user.created");
                }

                // create user in your database

                console.log("User created", user.id, {
                    email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    imageUrl: user.image_url,
                });

                break;
            }

            /**
             * =========================
             * USER UPDATED
             * =========================
             */
            case "user.updated": {
                const user = event.data;

                const emailObj = user.email_addresses?.[0];
                const email = emailObj?.email_address;

                // ✅ Email verified check
                const isVerified = emailObj?.verification?.status === "verified";

                // ✅ Clerk public metadata
                // const isSubscribed = user.public_metadata?.isSubscribed ?? false;
                const isSubscribed =
                    user.public_metadata?.isSubscribed === true;

                // update user in your database with the new information

                console.log("User updated", user.id, {
                    firstName: user.first_name,
                    lastName: user.last_name,
                    imageUrl: user.image_url,
                    email,
                    isVerified,
                    isSubscribed,
                });

                break;
            }

            /**
             * =========================
             * USER DELETED
             * =========================
             */
            case "user.deleted": {
                const user = event.data;

                if (!user.id) {
                    throw new Error("Missing user id in deletion event");
                }

                // delete user from your database

                console.log("User deleted", user.id);
                break;
            }

            /**
             * =========================
             * SESSION EVENTS (optional)
             * =========================
             */
            case "session.created": {
                console.log("Session event", {
                    type: event.type,
                    id: (event.data as any)?.id,
                });
                break;
            }
            case "session.ended": {
                console.log("Session event", {
                    type: event.type,
                    id: (event.data as any)?.id,
                });
                break;
            }

            default:
                console.log("Unhandled event type:", event.type, event.data);
                break;
        }

        return new Response("Webhook processed", { status: 200 });

    } catch (err) {
        console.error("Error processing webhook event:", err);


        /**
         * IMPORTANT:
         * Return 500 so Clerk retries safely
         */
        return new Response("Internal error", { status: 500 });
    }


}