const exprss = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const authController = require("../controllers/account.controller")
const router = exprss.Router()

/**
 * @route POST /api/accounts
 * @desc Create a new account for the authenticated user
 * @access Private
 */
router.post("/",authMiddleware.authMiddleware,authController.createAccount)

/**
 * @route GET /api/accounts
 * @desc Get all accounts for the authenticated user
 * @access Private
 */
router.get("/",authMiddleware.authMiddleware,authController.getUserAccountsController)


// get account by id

router.get("/balance/:accountId",authMiddleware.authMiddleware,authController.getAccountBalanceController)


module.exports = router