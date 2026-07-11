

export const StripeCheckoutApiCall = async (apiRoute: string, priceId: string) => {

    if (!apiRoute) {
        throw new Error("API route is required for subscription.");
    }

    if (!priceId) {
        throw new Error("Price ID is required for subscription.");
    }
    // Call our backend to create a Stripe Checkout Session
    const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: priceId }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    // Redirect the user to Stripe's payment page
    // data.url is the Stripe checkout URL
    window.location.assign(data.url);
}