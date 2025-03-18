import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SubscriptionList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const auth = getAuth();

  useEffect(() => {
    // ✅ Listen to Firebase Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/stripe/products");
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching products:", data.error);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      alert("Please log in to subscribe.");
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ uid: user.uid, email: user.email, priceId }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.error) {
        alert(result.error);
      } else {
        window.location.href = result.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0 mt-2">Loading...</p>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="bg-white listing-card shadow-sm rounded-3 p-3 position-relative">
                <img
                  src={product.image}
                  className="img-fluid rounded-3"
                  alt={product.name}
                />
                <div className="listing-card-body pt-3">
                  <h6 className="card-title fw-bold mb-1">{product.name}</h6>
                  <p className="card-text text-muted mb-2">
                    {product.currency} {product.price}
                  </p>
                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={() => handleSubscribe(product.priceId)} // ✅ Send priceId
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
