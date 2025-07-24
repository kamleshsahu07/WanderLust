const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js");

router.route("/signup")
    .get(userController.renderSignupform)
    .post(wrapAsync(userController.signup));

// router.get("/signup",userController.renderSignupform);

// router.post("/signup",wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect : "/login" , failureFlash:true }) , userController.login);

// router.get("/login",userController.renderLoginForm);

// router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect : " /login " , failureFlash:true }) , userController.login);

router.get("/logout",userController.logout);

module.exports=router;