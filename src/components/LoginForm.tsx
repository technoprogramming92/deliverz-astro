import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful! Redirecting...");
      window.location.href = "/"; // Redirect to home page
    } catch (error: any) {
      setError(error.message);
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

      <button
        type="submit"
        className="btn btn-success btn-lg py-3 px-4 text-uppercase w-100 mt-4"
      >
        Login <i className="bi bi-arrow-right ms-2"></i>
      </button>

      <p className="text-center mt-3">
        Don't have an account?{" "}
        <a href="#" className="text-success" onClick={() => switchToSignup()}>
          Click here to register
        </a>
      </p>
    </form>
  );
};

// Function to switch modal from Login to Signup
const switchToSignup = () => {
  const loginModal = document.getElementById(
    "exampleModalToggle"
  ) as HTMLElement;
  const signupModal = document.getElementById(
    "exampleModalToggle2"
  ) as HTMLElement;

  if (loginModal && signupModal) {
    loginModal.classList.remove("show");
    loginModal.setAttribute("aria-hidden", "true");
    loginModal.style.display = "none";

    signupModal.classList.add("show");
    signupModal.setAttribute("aria-hidden", "false");
    signupModal.style.display = "block";
  }
};

export default LoginForm;
