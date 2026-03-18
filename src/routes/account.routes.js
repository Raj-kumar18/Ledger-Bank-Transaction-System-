const exprss = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const createAccount = require("../controllers/account.controller")
const router = exprss.Router()

router.post("/",authMiddleware,createAccount)

module.exports = router