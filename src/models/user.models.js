const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose({
    email:{
        type:String,
        require:[true,"Email is requuire for creating a user"],
        trim:true,
        lowercase:true,
        math:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Inalid Email User"],
        unique:[true,"Email already eist"]
    },
    name:{
        type:String,
        required:[true,"Name is requird for creting an Account"]
    },
    password:{
        type:String,
        required:[true,"Password is required to create an Account"],
        minlength:[6,"Password should contain more than 6 character"],
        select:false
    }
},{timestamps:true})



userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hash = await bcrypt.hash(this.password,10)
    this.password= hash

    return next()
})


userSchema.methods.comparePssword = async function (password) {
    return await bcrypt.compare(password,this.password)
}


const userModel = mongoose.model("User",userSchema)

module.exports=userModel