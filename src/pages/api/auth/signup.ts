import type { APIRoute } from "astro";
import { auth, db } from "../../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    // ✅ Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // ✅ Send email verification
    await sendEmailVerification(user);

    // ✅ Store user data in Firestore
    await setDoc(doc(db, "customers", user.uid), {
      uid: user.uid,
      email,
      fullname: "",
      address: "",
      city: "",
      pincode: "",
      location: null,
      emailVerified: false, // ✅ Track email verification status
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message:
          "Signup successful! Please verify your email before logging in.",
        user: { uid: user.uid, email },
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
