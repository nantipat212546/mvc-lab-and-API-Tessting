
const productModel = require("../models/productModel");

async function showProducts(req, res) {
    try {
        const keyword = (req.query.keyword || "").trim();

        let products;

        if (keyword) {
            products = await productModel.searchProducts(keyword);
        } else {
            products = await productModel.getAllProducts();
        }

        res.render("index", {
            products,
            keyword
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
}

module.exports = {
    showProducts
};
