// routes/paymentRoutes.js
import express from "express";
const router = express.Router();

// Example route
router.get("/pay", (req, res) => {
  res.send("Payment route working");
});

export default router;
