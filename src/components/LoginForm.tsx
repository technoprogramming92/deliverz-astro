import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Prevent login if email is not verified
      if (!user.emailVerified) {
        setResendEmail(true);
        setError("⚠️ Email not verified. Please check your inbox.");
        return;
      }

      // ✅ Fetch user details from Firestore
      const userRef = doc(db, "customers", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User not found in Firestore.");
      }

      const userData = userSnap.data();
      const role = userData.role || "customer";

      // ✅ Store user session
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", user.email || "");

      alert(`Login Successful! Welcome, ${user.email}`);

      // ✅ Redirect based on role
      window.location.href = role === "admin" ? "/admin" : "/";
    } catch (error: any) {
      setError("⚠️ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        alert("✅ Verification email sent again. Please check your inbox.");
      }
    } catch (error) {
      alert("❌ Failed to resend verification email.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="input-group bg-white border rounded mb-3 p-2">
        <input
          name="email"
          type="email"
          className="form-control bg-white border-0 ps-0"
          placeholder="Enter Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group bg-white border rounded mb-3 p-2">
        <input
          type="password"
          name="password"
          className="form-control bg-white border-0 ps-0"
          placeholder="Enter Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}

      {resendEmail && (
        <p className="text-warning">
          Didn't receive an email?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleResendEmail}
          >
            Click here to resend
          </button>
        </p>
      )}

      <button
        type="submit"
        className="btn btn-success btn-lg py-3 px-4 text-uppercase w-100 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Logging in...
          </>
        ) : (
          <>
            Login <i className="bi bi-arrow-right ms-2"></i>
          </>
        )}
      </button>

      <p className="text-center mt-3">
        Don't have an account?{" "}
        <a
          href="#"
          className="text-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalToggle2"
        >
          Click here to register
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
