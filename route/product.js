const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");
const { addProduct } = require("../controller/productController");

router.route("/addproduct").get(addProduct);

module.exports = router;