const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/products");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
