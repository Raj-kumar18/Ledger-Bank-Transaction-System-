const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")
const tokenBlacklistModel = require("../models/blackList.model")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.header.authoriziation?.split(" ")[1]

        if (!token) {
            throw new ApiError(401, "Token Not Found 😒")
        }

        const isBlackListed = await tokenBlacklistModel.findOne({ token })

        if (isBlackListed) {
            throw new ApiError(401, "Token is blacklisted, please login again")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)


        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        next()


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }


}

async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.header.authoriziation?.split(" ")[1]

    if (!token) {
        throw new ApiError(401, "Token Not Found 😒")
    }
    try {

        const isBlackListed = await tokenBlacklistModel.findOne({ token })

        if (isBlackListed) {
            throw new ApiError(401, "Token is blacklisted, please login again")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        if (!user.systemUser) {
            throw new ApiError(403, "Access Denied, System User Only")
        }
        req.user = user
        return next()
    } catch (error) {
        throw new ApiError(403, error?.message || "Access Denied, System User Only")
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}