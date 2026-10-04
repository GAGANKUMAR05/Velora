const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require('../middlewares.js');

const userController=require("../controllers/users.js");
router
.route("/signup")
.get(userController.renderSignup)
.post( userController.signup);

router
.route("/login")
.get( userController.renderLogin)
.post( saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
userController.Login
);

router.get("/logout", userController.Logout);

module.exports = router;