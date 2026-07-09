import checkoutApi from "@/lib/payment/stripe/checkout_api";


export async function POST(req: Request) {
    try {

        return await checkoutApi(req);

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