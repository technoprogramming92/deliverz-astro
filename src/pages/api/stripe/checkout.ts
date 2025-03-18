import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const POST: APIRoute = async ({ request }) => {
  const { uid, email, productId, price, planName, currency } =
    await request.json();

  if (!uid || !email || !price) {
    return new Response(
      JSON.stringify({ error: "Missing user details or price" }),
      { status: 400 }
    );
  }

  try {
    // ✅ Check if customer already exists in Stripe
    const existingCustomers = await stripe.customers.list({ email });
    let customer = existingCustomers.data.length
      ? existingCustomers.data[0]
      : null;

    // ✅ If customer doesn't exist, create a new one
    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata: { uid }, // Store Firebase UID in Stripe for reference
      });
    }

    // ✅ Create Stripe Checkout Session with the existing customer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customer.id, // ✅ Use existing customer ID
      line_items: [
        {
          price_data: {
            currency: currency || "CAD",
            unit_amount: price, // Price in cents
            product_data: {
              name: planName,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { uid, productId, planName, price },
      success_url:
        "https://yourwebsite.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://yourwebsite.com/cancel",
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
