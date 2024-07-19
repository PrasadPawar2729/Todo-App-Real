const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

 username:{
    type:String,
    require:true
 },
 email:{
    type:String,
    require:true
 },
 pass:{
    type:String,
    require:true
 },
role:{
   type:String,
   enum:["admin","user"],
   default:"user"
}
},
{
    versionKey:false
}


)

const usermodel = mongoose.model("user",userSchema)

module.exports = {usermodel}
