import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [photoURL, setPhotoURL] = useState("/assets/img/avatar.jpg");
  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const authUser = auth.currentUser;
      if (!authUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "customers", authUser.uid); // ✅ Ensure correct Firestore collection
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser(authUser);
          setFullname(data.fullname || "");
          setPhone(data.phone || "");
          setEmail(data.email || authUser.email);
          setAddress(data.address || "");
          setCity(data.city || "");
          setPincode(data.pincode || "");
          setLocation(data.location || null);
          setPhotoURL(data.photoURL || "/assets/img/avatar.jpg");
        } else {
          console.warn("⚠️ User data not found in Firestore.");
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      }
      setIsLoading(false);
    };

    // ✅ Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe(); // ✅ Cleanup listener on component unmount
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, "customers", user.uid);
      await updateDoc(userRef, {
        fullname,
        phone,
        address,
        city,
        pincode,
        location,
        photoURL,
      });

      alert("✅ Profile updated successfully!");
    } catch (error: any) {
      alert("❌ Error updating profile: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "customers", user.uid));
      await signOut(auth);
      alert("✅ Profile deleted successfully.");
      window.location.href = "/";
    } catch (error: any) {
      alert("❌ Error deleting profile: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // ✅ Ensure session is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout Error:", error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setLocation(coords);
        alert(`✅ Location updated: ${coords}`);
      },
      (error) => {
        alert("❌ Unable to retrieve your location: " + error.message);
      }
    );
  };

  return (
    <div className="container py-5">
      <div className="shadow-sm bg-white rounded overflow-hidden border">
        <div className="p-4">
          <h3 className="fw-bold">Profile</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="text-center mb-3">
                <img
                  src={photoURL}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Live Location</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={location || ""}
                    disabled
                  />
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={getCurrentLocation}
                  >
                    Get Location
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100">
                Update Profile
              </button>
            </form>
          )}
          <div className="mt-3 text-center">
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Profile
            </button>
            <button onClick={handleLogout} className="btn btn-secondary ms-2">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
