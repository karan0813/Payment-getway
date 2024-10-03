import React from "react";
import axios from "axios";

function RazorpayPayment() {
  const initPayment = (data) => {
    const options = {
      key: process.env.ROZERPAY_KEY_ID, // Make sure this is correct
      amount: data.amount,
      currency: data.currency,
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = "http://localhost:8080/api/payment/verify";
          const { data } = await axios.post(verifyUrl, response);
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      const orderUrl = "http://localhost:8080/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: 50000 }); // Amount in paise (500 INR)
      console.log(data);
      initPayment(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default RazorpayPayment;
