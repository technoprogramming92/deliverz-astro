import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase.ts";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // ✅ Listen to Firebase Authentication State Changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "customers", firebaseUser.uid); // ✅ Ensure collection name is correct
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser({ ...firebaseUser, ...userSnap.data() });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // ✅ Cleanup listener when component unmounts
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // ✅ Clear user state
      localStorage.clear(); // ✅ Clear session
      window.location.href = "/"; // ✅ Redirect after logout
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm osahan-header py-0">
      <div className="container">
        <a className="navbar-brand me-0 me-lg-3 me-md-3" href="/">
          <img
            src="/assets/img/new-logo.png"
            alt="Brand Logo"
            className="img-fluid d-none d-md-block"
          />
          <img
            src="/assets/img/new-logo.png"
            alt="Brand Logo"
            className="d-block d-md-none d-lg-none img-fluid"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto me-3 top-link">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/orders">
                Orders
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <a
                href="/profile"
                className="d-flex align-items-center btn btn-light border rounded-pill px-3"
              >
                <img
                  src={user.photoURL || "/assets/img/avatar.jpg"}
                  alt="User Avatar"
                  className="rounded-circle me-2"
                  style={{ width: "35px", height: "35px" }}
                />
                <span className="text-dark">
                  {user.fullname || user.email || "My Profile"}
                </span>
              </a>
            ) : null}

            {user ? (
              <button
                className="btn btn-danger rounded-pill px-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <a className="btn btn-success rounded-pill px-3" href="/login">
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
