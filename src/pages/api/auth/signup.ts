import type { APIRoute } from "astro";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore();

export const POST: APIRoute = async ({ request }) => {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Store user data in Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      fullname: "",
      address: "",
      city: "",
      pincode: "",
      liveLocation: null,
    });

    return new Response(JSON.stringify({ user: { uid, email } }), {
      status: 200,
    }); // ✅ Return correct structure
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
