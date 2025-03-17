import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }

  try {
    // Fetch all Stripe customers with this email
    const customers = await stripe.customers.list({ email });

    if (!customers.data.length) {
      return new Response(JSON.stringify({ error: "No customer found" }), {
        status: 404,
      });
    }

    const customerId = customers.data[0].id;

    // Fetch the customer's payment history
    const payments = await stripe.paymentIntents.list({ customer: customerId });

    return new Response(JSON.stringify({ orders: payments.data }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
