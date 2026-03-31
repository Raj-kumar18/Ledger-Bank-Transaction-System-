const mongoose = require("mongoose")
const ledgerModel = require("./ledger.models")

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


accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        { $match :{account: this._id} },
        { $group: {
            _id: null,
            totalDebit: { $sum: { $cond : { if: { $eq: ["$type", "DEBIT"] }, then: "$amount", else: 0 } } },
            totalCredit: { $sum: { $cond : { if: { $eq: ["$type", "CREDIT"] }, then: "$amount", else: 0 } } }
        }},
        { $project: {
            _id: 0,
            balance: { $subtract: ["$totalCredit", "$totalDebit"] }
        }}
    ])


    return balanceData.length > 0 ? balanceData[0].balance : 0

}

const accountModel = mongoose.model("Account", accountSchema)


module.exports = accountModel