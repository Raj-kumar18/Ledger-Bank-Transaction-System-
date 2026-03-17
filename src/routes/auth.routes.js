const express = require(express)
const userRegisterController = require("../controllers/auth.controller")
const userLoginController = require("../controllers/auth.controller")
const router = express.Router()


router.post("/register",userRegisterController) 
router.post("/login",userLoginController) 


module.exports = router