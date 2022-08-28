const express = require("express");
const router = express.Router();

const { signup } = require("../controller/userController");
const { login, logout, forgotPassword, passwordReset, getLoggedInUser, changePassword, updateUserDetails, adminAllUser} = require("../controller/userController");
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUser);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);

module.exports = router;
