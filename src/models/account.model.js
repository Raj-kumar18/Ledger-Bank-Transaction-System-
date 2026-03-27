const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be assocaited with user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"], // 'values' (plural) aur comma hataya
            message: "{VALUE} is not a valid status" // Aap {VALUE} use kar sakte hain error dikhane ke liye
        },
        default: "ACTIVE",
        uppercase: true, // Safety ke liye: ye input ko hamesha capital rakhega
        trim: true
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
}, { timestamps: true })

accountSchema.index({ user: 1, status: 1 })


const accountModel = mongoose.model("Account", accountSchema)

module.exports = accountModel