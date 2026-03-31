const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlacklistModel = require("../models/blackList.model")
async function userRegisterController(req, res) {
    try {
        const { email, password, name } = req.body

        const isExist = await userModel.findOne({ email: email })
        if (isExist) {
            return res.status(422).json({ message: "user already exsit", status: "failed" })
        }

        const newUser = await userModel.create({ email, password, name })

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })
        
        res.status(201).json({ message: "user registered successfully", newUser, token })
        await emailService.sendRegistrationEmail(newUser.email,newUser.name)
    } catch (err) {
        console.log(err)
        res.status(409).json("user registered failled")
    }
}



async function userLoginController(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(401).json({ message: "Email or phone is Inavalid" })
        }

        const isInavlidUsr = await user.comparePassword(password)
        if (!isInavlidUsr) {
            return res.status(401).json({ message: "Email or phone is Inavalid" })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(201).json({ message: "user LoogedIN successfully", user, token })


    }
    catch (err) {
        console.log(err)
        res.status(409).json("user LoogedIN failled")
    }
}



async function userLogoutController(req,res){
    const token = req.cookies.token || req.header.authoriziation?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Token Not Found 😒" })
    }

    await tokenBlacklistModel.create({ token })
    res.clearCookie("token")

    return res.status(200).json({ message: "User logged out successfully" })

}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}