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


async function getAccountBalanceController(req,res){
    const {accountId} = req.params

    if(!accountId){
        return res.status(400).json(new ApiResponse(
            400,
            "Account ID is required"
        ))
    }

    try{
        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        })

        if(!account){
            return res.status(404).json(new ApiResponse(
                404,
                "Account not found"
            ))
        }
        const balance = await account.getBalance()

        return res.status(200).json(new ApiResponse(
            200,
            "Account balance retrieved successfully",
            {accountId, balance}
        ))
    }
    catch(error){
        return res.status(500).json(new ApiResponse(
            500,
            "An error occurred while retrieving account balance",
            null,
            error.message
        ))
    }
}


module.exports = {
    createAccount,
    getUserAccountsController,
    getAccountBalanceController
}