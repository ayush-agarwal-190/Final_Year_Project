const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/products.json"));
  res.json(data);
});

router.post("/order", (req, res) => {
  const order = req.body;
  console.log("New order received:", order);
  res.status(201).json({ message: "Order placed successfully!" });
});

module.exports = router;
