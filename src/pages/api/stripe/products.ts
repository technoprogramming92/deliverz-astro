import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const GET: APIRoute = async () => {
  try {
    const products = await stripe.products.list({
      expand: ["data.default_price"],
    });

    const formattedProducts = products.data.map((product) => {
      const price = product.default_price as Stripe.Price;
      return {
        id: product.id, // Product ID
        name: product.name,
        description: product.description || "",
        price: price.unit_amount ? price.unit_amount / 100 : 0, // Price Amount
        currency: price.currency.toUpperCase(),
        priceId: price.id, // ✅ Include the priceId here
        image: product.images[0] || "/assets/img/tiffin11.png",
        paymentLink: product.metadata.payment_link || "#",
      };
    });

    return new Response(JSON.stringify(formattedProducts), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
