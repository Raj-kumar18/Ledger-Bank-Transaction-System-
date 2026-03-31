const express = require("express")
const userRegisterController = require("../controllers/auth.controller")
const userLoginController = require("../controllers/auth.controller")
const router = express.Router()


router.post("/register",userRegisterController.userRegisterController) 
router.post("/login",userLoginController.userLoginController) 
router.post("/logout",userLoginController.userLogoutController)


module.exports = router