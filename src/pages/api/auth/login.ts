import type { APIRoute } from "astro";
import { auth } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const POST: APIRoute = async ({ request }) => {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return new Response(
      JSON.stringify({
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
