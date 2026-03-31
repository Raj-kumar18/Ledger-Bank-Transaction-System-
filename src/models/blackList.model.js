const mongoose = require("mongoose")

const tokenBlackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required for blacklisting"],
        unique:true
    }
},{timestamps:true})


tokenBlackListSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3 // 3 din ke baad token automatically delete ho jayega
})

const tokenBlackListModel = mongoose.model("BlackList",tokenBlackListSchema)

module.exports = tokenBlackListModel