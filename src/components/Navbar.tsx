import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase.ts";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...firebaseUser, ...userSnap.data() });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null); // Clear state
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm osahan-header py-0">
      <div className="container">
        <a className="navbar-brand me-0 me-lg-3 me-md-3" href="/">
          <img
            src="/assets/img/new-logo.png"
            alt="#"
            className="img-fluid d-none d-md-block"
          />
          <img
            src="/assets/img/new-logo.png"
            alt="#"
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
                  src={user.photoURL || "/assets/img/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-circle me-2"
                  style={{ width: "35px", height: "35px" }}
                />
                <span className="text-dark">
                  {user.fullname || "My Profile"}
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
