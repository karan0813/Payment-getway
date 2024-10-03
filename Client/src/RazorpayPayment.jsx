import React, { useState } from "react";
import axios from "axios";

function RazorpayPayment() {
  const [amount, setAmount] = useState(100);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const initPayment = (data) => {
    const options = {
      key: process.env.ROZERPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Cool Company",
      description: "Awesome Product Purchase",
      order_id: data.id,
      handler: async (response) => {
        try {
          setLoading(true);
          const verifyUrl = "http://localhost:8080/api/payment/verify";
          const { data } = await axios.post(verifyUrl, response);
          setSuccess("Woohoo! Payment successful! 🎉");
          setError(null);
        } catch (error) {
          console.error(
            "Verification error:",
            error.response?.data || error.message
          );
          setError("Oops! Payment verification failed 😕");
          setSuccess(null);
        } finally {
          setLoading(false);
        }
      },
      theme: {
        color: "#6C63FF",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const orderUrl = "http://localhost:8080/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: amount * 100 });
      console.log("Order data:", data);
      initPayment(data);
    } catch (error) {
      console.error(
        "Order creation error:",
        error.response?.data || error.message
      );
      setError("Failed to create order 😞");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="razorpay-container">
      <div className="payment-card">
        <h2>Make a Payment</h2>
        <div className="amount-input">
          <label htmlFor="amount">Amount (INR)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value)))}
            min="1"
          />
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="pay-button"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}

export default RazorpayPayment;
