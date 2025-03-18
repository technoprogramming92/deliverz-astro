import { useState } from "react";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Signup failed");
      } else if (result.user) {
        alert(`Signup Successful! Welcome, ${result.user.email}`);
        window.location.href = "/";
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Registering...
          </>
        ) : (
          <>
            Register <i className="bi bi-arrow-right ms-2"></i>
          </>
        )}
      </button>

      <p className="text-center mt-3">
        Already have an account?{" "}
        <a
          href="#"
          className="text-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalToggle"
        >
          Click here to login
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
