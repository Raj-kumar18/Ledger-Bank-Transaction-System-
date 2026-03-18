const accountModel = require("../models/account.model")
const ApiResponse = require("../utils/ApiResponse")




async function createAccount(req,res){
    const user = req.user

    const account = await accountModel.create({
        user:user._id,
    })

    return res.status(201).json(new ApiResponse(
        201,
        "Accoun created successfully",
        account
    ))
}

module.exports = createAccount