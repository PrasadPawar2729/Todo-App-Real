const jwt = require('jsonwebtoken')
//we can checking the req.role
const {usermodel} = require('../model/usermodel')


const auth = (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1]
 if(token){

jwt.verify(token,'todoapp',async(err,decoded)=>{
    if(decoded){
        const {userID} =decoded;
        const user = await usermodel.findOne({_id:userID})
        const requiredRole = user.role;
        req.role = requiredRole;
        next()
    }
    else{
        res.json({err})
    }
})

 }

 else{
    res.json({msg:'please login !'})
 }
    

}

module.exports={auth}