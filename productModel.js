
const db = require("../config/db");

async function getAllProducts() {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE is_deleted = 0"
    );
    return rows;
}

async function searchProducts(keyword) {
    const [rows] = await db.query(
        `SELECT * FROM products
         WHERE name LIKE ? AND is_deleted = 0`,
        [`%${keyword}%`]
    );
    return rows;
}

async function getProductById(id) {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE id = ? AND is_deleted = 0",
        [id]
    );
    return rows[0] || null;
}

async function createProduct(product) {
    const { name, price, discount, review_count, image_url } = product;

    const [result] = await db.query(
        `INSERT INTO products
         (name, price, discount, review_count, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [name, price, discount, review_count, image_url]
    );

    return result.insertId;
}

async function updateProduct(id, product) {
    const { name, price, discount, review_count, image_url } = product;

    const [result] = await db.query(
        `UPDATE products
         SET name = ?, price = ?, discount = ?,
             review_count = ?, image_url = ?
         WHERE id = ? AND is_deleted = 0`,
        [name, price, discount, review_count, image_url, id]
    );

    return result.affectedRows;
}

async function deleteProduct(id) {
    const [result] = await db.query(
        "UPDATE products SET is_deleted = 1 WHERE id = ? AND is_deleted = 0",
        [id]
    );

    return result.affectedRows;
}

async function restoreProduct(id) {
    const [result] = await db.query(
        "UPDATE products SET is_deleted = 0 WHERE id = ? AND is_deleted = 1",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    getAllProducts,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct
};
