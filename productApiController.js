
const productModel = require("../models/productModel");

function validId(id) {
    return /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id));
}

function parseProduct(body) {
    const name = body?.name;
    const price = body?.price;
    const discount = body?.discount ?? 0;
    const review_count = body?.review_count ?? 0;
    const image_url = body?.image_url ?? "";

    if (
        typeof name !== "string" ||
        !name.trim() ||
        name.length > 100 ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100 ||
        !Number.isInteger(review_count) ||
        review_count < 0 ||
        typeof image_url !== "string" ||
        image_url.length > 500
    ) {
        return null;
    }

    return {
        name: name.trim(),
        price,
        discount,
        review_count,
        image_url
    };
}

// READ ALL
async function getAll(req, res) {
    try {
        const products = await productModel.getAllProducts();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// READ BY ID
async function getById(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const product = await productModel.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// SEARCH
async function search(req, res) {
    try {
        const keyword = req.params.keyword;
        const products = await productModel.searchProducts(keyword);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// CREATE
async function create(req, res) {
    const product = parseProduct(req.body);

    if (!product) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    try {
        const id = await productModel.createProduct(product);

        return res.status(201).json({
            id,
            message: "Product created"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// UPDATE
async function update(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const product = parseProduct(req.body);

    if (!product) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    try {
        const affectedRows = await productModel.updateProduct(
            req.params.id,
            product
        );

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json({ message: "Product updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// SOFT DELETE
async function remove(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const affectedRows = await productModel.deleteProduct(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.json({ message: "Product soft-deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

// RESTORE
async function restore(req, res) {
    if (!validId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const affectedRows = await productModel.restoreProduct(req.params.id);

        if (affectedRows === 0) {
            return res.status(404).json({
                error: "Deleted product not found"
            });
        }

        return res.json({ message: "Product restored" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    }
}

module.exports = {
    getAll,
    getById,
    search,
    create,
    update,
    remove,
    restore
};
