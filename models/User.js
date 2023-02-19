
// validation of data as well creating new Shema for users
// using bcrypt to encrypt the password of users 
// saving hash inside password field in data base 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required : [true, "Please enter an UserName."]

    },
    email:{
        type:String,
        required : [true, "Please enter an Email."],
        unique: true,
        validate:[isEmail, " Please Enter a valid Email."]

    },
    password:{
        type:String,
       

    }
    

})

// converting normal password into hash value 
UserSchema.pre('save',function(next){
    if(!this.isModified('password'))
    return next()
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
if(err){
    return next(err)}
this.password = passwordHash
next()

}
    )
})


const User = new mongoose.model("User",UserSchema)
module.exports = User