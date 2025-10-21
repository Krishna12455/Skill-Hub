// // server.js
// const express = require("express");
// const Razorpay = require("razorpay");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Replace with your actual Razorpay keys
// const razorpay = new Razorpay({
//   key_id: "YOUR_RAZORPAY_KEY_ID",
//   key_secret: "YOUR_RAZORPAY_SECRET",
// });

// app.post("/api/createOrder", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: amount, // amount in smallest currency unit
//       currency: "INR",
//       receipt: "receipt_order_" + Math.random().toString(36).substring(2, 12),
//     };

//     const order = await razorpay.orders.create(options);
//     return res.json(order);
//   } catch (err) {
//     console.error("Order creation failed:", err);
//     res.status(500).send("Something went wrong");
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// server.js
// const express = require("express");
// const Razorpay = require("razorpay");
// const cors = require("cors");
// const bodyParser = require("body-parser");
import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock payment system for testing (replace with real Razorpay when ready)
// const razorpay = new Razorpay({
//   key_id: "YOUR_RAZORPAY_KEY_ID",        // Replace with your Razorpay key
//   key_secret: "YOUR_RAZORPAY_SECRET",    // Replace with your Razorpay secret
// });

// Create order endpoint
app.post("/api/createOrder", async (req, res) => {
  const { amount } = req.body;

  try {
    // Mock order for testing
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
      created_at: Date.now()
    };

    console.log("Mock order created:", mockOrder);
    res.json(mockOrder);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Razorpay server running on http://localhost:${PORT}`);
});
