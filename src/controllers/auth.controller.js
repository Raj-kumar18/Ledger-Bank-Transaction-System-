const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")

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




module.exports = {
    userRegisterController,
    userLoginController
}