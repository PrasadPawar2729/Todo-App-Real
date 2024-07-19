const express = require('express')
const {usermodel} = require('../model/usermodel')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRouter.post('/register',(req,res)=>{
    //logic
   const {username,email,pass,role}=req.body;
  
     
    try{
        bcrypt.hash(pass, 5, async(err, hash)=> {
         

          if(err){
               res.status(200).json(err)          }
          else{
            const user = new usermodel({
                username,email,pass:hash,role
            })
            await user.save()
            res.status(200).json({message:'a new user has been registered'})
          }


        });



    }
    catch(err){
        res.status(500).json({error:err})
    }


})

userRouter.post('/login',async(req,res)=>{
    //logic
const {email,pass} = req.body;

try{

const user = await  usermodel.findOne({email})

if(user){
    bcrypt.compare(pass, user.pas, (err, result)=> {
      
            const token = jwt.sign({userID :user._id},'todoapp')
        res.status(200).json({msg:'Login Successfully',token})
    
    })
}
else{
    res.status(200).json({msg:'wrong credintal'})
}

}
catch(err){

    res.status(400).json({error:err})
}



})


module.exports = {userRouter}