import { useEffect, useState } from "react";

const CustomerOrders = ({ email }: { email: string }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/stripe/orders", {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setOrders(result.orders);
        }
      } catch (err) {
        setError("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, [email]);

  return (
    <div>
      <h3>Your Orders</h3>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item">
              <strong>Order ID:</strong> {order.id} <br />
              <strong>Amount:</strong> ${order.amount / 100} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Date:</strong>{" "}
              {new Date(order.created * 1000).toLocaleString()} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOrders;
