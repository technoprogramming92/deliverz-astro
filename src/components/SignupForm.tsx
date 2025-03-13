import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(`Signup Successful! Welcome, ${userCredential.user.email}`);
      window.location.href = "/"; // Redirect to home page
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
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
      <div className="input-group bg-white border rounded mb-3 p-2">
        <input
          type="password"
          name="confirmPassword"
          className="form-control bg-white border-0 ps-0"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}

      <button
        type="submit"
        className="btn btn-success btn-lg py-3 px-4 text-uppercase w-100 mt-4"
      >
        Register <i className="bi bi-arrow-right ms-2"></i>
      </button>

      <p className="text-center mt-3">
        Already have an account?{" "}
        <a href="#" className="text-success" onClick={() => switchToLogin()}>
          Click here to login
        </a>
      </p>
    </form>
  );
};

// Function to switch modal from Signup to Login
const switchToLogin = () => {
  const signupModal = document.getElementById(
    "exampleModalToggle2"
  ) as HTMLElement;
  const loginModal = document.getElementById(
    "exampleModalToggle"
  ) as HTMLElement;

  if (signupModal && loginModal) {
    signupModal.classList.remove("show");
    signupModal.setAttribute("aria-hidden", "true");
    signupModal.style.display = "none";

    loginModal.classList.add("show");
    loginModal.setAttribute("aria-hidden", "false");
    loginModal.style.display = "block";
  }
};

export default SignupForm;
