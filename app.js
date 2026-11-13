
const express = require("express");
const path = require("path");

const webRoutes = require("./routes/webRoutes");
const productApiRoutes = require("./routes/productApiRoutes");

const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", webRoutes);
app.use("/api/products", productApiRoutes);

app.listen(3001, () => {
    console.log("MVC Server running on port 3001");
});
