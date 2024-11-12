const express = require("express");
const productController = require("../controllers/productController");
const checkToken = require("../middlewares/checkToken");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.get("/", productController.read);
router.post("/search", productController.search);
router.post(
  "/create",
  checkToken,
  checkRole("admin"),
  productController.create
);
router.put(
  "/update/:productId",
  checkToken,
  checkRole("admin"),
  productController.update
);
router.delete(
  "/delete/:productId",
  checkToken,
  checkRole("admin"),
  productController.deletePost
);

// Lu' @@
module.exports = router;
