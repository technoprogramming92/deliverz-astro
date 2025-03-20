import type { APIRoute } from "astro";
import Stripe from "stripe";
import { dbOrders } from "../../../lib/firebase"; // ✅ Use `dbOrders` from `deliverz-auth`
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { uid, email, productId, price, planName, currency } =
      await request.json();

    if (!uid || !email || !price) {
      console.error("❌ Missing required parameters:", { uid, email, price });
      return new Response(
        JSON.stringify({ error: "Missing user details or price" }),
        { status: 400 }
      );
    }

    console.log(
      `🔹 Processing payment for user ${uid} - ${email} - ${planName}`
    );

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

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal", "klarna", "sofort"],
      mode: "payment",
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: currency || "CAD",
            unit_amount: price,
            product_data: {
              name: planName,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { uid, productId, planName, price },
      success_url: "https://deliverz-astro.vercel.app/success",
      cancel_url: "https://deliverz-astro.vercel.app/cancel",
    });

    console.log("✅ Stripe Checkout session created:", session.id);

    // ✅ Store order in Firestore (`orders` collection in `deliverz-auth`)
    await addDoc(collection(dbOrders, "orders"), {
      userId: uid,
      email: email,
      productId: productId,
      planName: planName,
      price: price / 100, // Convert cents to dollars
      currency: currency || "CAD",
      stripeCustomerId: customer.id,
      stripeSessionId: session.id,
      status: "pending", // Order is pending until payment is confirmed
      createdAt: new Date(),
    });

    console.log("✅ Order successfully stored in Firestore for", uid);

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error: any) {
    console.error("❌ Error processing checkout:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
