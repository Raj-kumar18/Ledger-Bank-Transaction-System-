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

async function getUserAccountsController(req,res){
    const user = req.user
    const accounts = await accountModel.find({
        user:user._id
    })
    return res.status(200).json(new ApiResponse(
        200,
        "User accounts retrieved successfully",
        accounts
    ))
}

module.exports = {
    createAccount,
    getUserAccountsController
}