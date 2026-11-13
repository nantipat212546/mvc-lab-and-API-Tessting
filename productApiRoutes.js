
const express = require("express");
const router = express.Router();

const controller = require("../controllers/productApiController");

router.get("/", controller.getAll);
router.get("/search/:keyword", controller.search);
router.get("/:id", controller.getById);

router.post("/", controller.create);
router.put("/restore/:id", controller.restore);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
