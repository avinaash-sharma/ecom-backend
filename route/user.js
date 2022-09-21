const express = require("express");
const router = express.Router();

const { signup, managerAllUser } = require("../controller/userController");
const { login, logout, forgotPassword, passwordReset, getLoggedInUser, changePassword, updateUserDetails, adminAllUser, adminGetOneUser,adminDeleteOneUserDetails,adminUpdateOneUserDetails} = require("../controller/userController");
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUser);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails);

//admin only routes
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);
router.route("/admin/user/:id").get(isLoggedIn, customRole("admin"), adminGetOneUser);
router.route("/admin/user/:id").put(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails);
router.route("/admin/delete/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOneUserDetails);
//manager only route
router.route("/manager/users").get(isLoggedIn, customRole("manager"), managerAllUser);

module.exports = router;
