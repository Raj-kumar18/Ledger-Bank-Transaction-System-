const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.header.authoriziation?.split(" ")[1]

        if (!token) {
            throw new ApiError(401, "Token Not Found 😒")
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

module.exports = authMiddleware