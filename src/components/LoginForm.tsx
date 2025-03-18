import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(); // Get Firebase Auth instance

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Firebase login directly
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      sessionStorage.setItem("loggedIn", "true");

      alert(`Login Successful! Welcome, ${user.email}`);
      window.location.href = "/"; // Redirect to home page
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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
