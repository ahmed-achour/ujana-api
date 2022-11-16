const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const { getEnvironmentPath } = require("./app/utils");
require("dotenv").config({ path: getEnvironmentPath() });
require("./app/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

const UserController = require("./app/controllers/userController");
const CategoryController = require("./app/controllers/CategoryController");
const ProductController = require("./app/controllers/productController")
const OrderController = require("./app/controllers/orderController")

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.append("cross-origin-resource-policy", "*");
    },
  })
);
app.use("/users", UserController);
app.use("/categories", CategoryController);
app.use("/products", ProductController);   
app.use("/orders", OrderController);
app.get("/", (_req, res) => res.status(200).send("💊.."));

app.listen(PORT, () => {
  console.log(`💊 server running on port ${PORT}...`);
});
