const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const dotenv = require("dotenv");

// env Config
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

console.log(process.env.ROZERPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: process.env.ROZERPAY_KEY_ID,
  key_secret: process.env.ROZERPAY_KEY_SECRET,
});

app.post("/api/payment/orders", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);
    res.json(order);
  } catch (error) {
    console.error("Error in /api/payment/orders:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

app.post("/api/payment/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.ROZERPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Error in /api/payment/verify:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error!", error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
