import type { APIRoute } from "astro";
import { auth, db } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    // ✅ Authenticate user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // ✅ Prevent login if email is not verified
    if (!user.emailVerified) {
      return new Response(
        JSON.stringify({
          error: "Email not verified. Please check your inbox.",
        }),
        { status: 403 }
      );
    }

    // ✅ Get user details from Firestore
    const userRef = doc(db, "customers", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "User not found in Firestore" }),
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    return new Response(
      JSON.stringify({
        message: "Login successful!",
        user: {
          uid: user.uid,
          email: user.email,
          role: userData.role || "customer",
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
