import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const POST: APIRoute = async ({ request }) => {
  const { uid, email, priceId } = await request.json();

  console.log("Received priceId:", priceId); // ✅ Debugging log

  if (!uid || !email || !priceId) {
    return new Response(
      JSON.stringify({ error: "Missing user details or priceId" }),
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { uid },
      success_url:
        "https://deliverz-astro.vercel.app/success?session_id={CHECKOUT_SESSION_ID}", // ✅ Replace with your domain
      cancel_url: "https://deliverz-astro.vercel.app/cancel",
    });

    console.log("Stripe Checkout URL:", session.url); // ✅ Debugging log

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
