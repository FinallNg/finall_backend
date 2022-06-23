const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/users');
const {userValidation, loginValidation} = require('../validations/user.validation');
require('dotenv').config()
const salt = parseInt(process.env.SALT);

async function getAllUsers(req,res){
    const users= await Users.find()
    return res.status(200).json(users)
}

async function createUser(req,res){
    const data = req.body
    const {error, value} = await userValidation(data)
    if (error){
        return res.status(400).json({msg:error.details[0].message})
    }
    else{
        user_exists = await Users.findOne({email: value.email})
        if(user_exists){
            return res.status(400).json({"message":"email already exists"})
        }else{
            hashedPassword = await bcrypt.hash(value.password,salt);
            value.password = hashedPassword;
            const user = new Users(value)
            refreshToken = jwt.sign({id:user.id, role:user.role},process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})
            accessToken = jwt.sign({id:user.id, role:user.role},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
            user.refreshToken = refreshToken
            user.save()
            return res.cookie('jwt',refreshToken, {httpOnly:true, maxAge:24*60*60*1000, sameSite:'None', secure:true}).status(201).json({msg:"User Created Successfully", data:user, "token":accessToken});
        }
    }
}

async function loginUser(req,res){
    const data = req.body
    const {error, value} = await loginValidation(data)
    if (error){
        return res.status(400).json({msg:error.details[0].message})
    }
    else{
        user_exists = await Users.findOne({email: value.email}).select('+password');
        if(!user_exists){
            return res.status(400).json({"message":"Invalid Credentials"})
        }else{
            password = await bcrypt.compare(value.password, user_exists.password)
            if(!password){
                return res.status(400).json({"message":"Invalid Credentials"})
            }else{
                refreshToken = jwt.sign({id:user_exists.id, role:user_exists.role},process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})
                accessToken = jwt.sign({id:user_exists.id, role:user_exists.role},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
                user_exists.refreshToken = refreshToken
                user_exists.save()
                return res.cookie('jwt',refreshToken, {httpOnly:true, maxAge:24*60*60*1000, sameSite:'None'}).status(200).json({"message":"Log In Successful", data:user_exists, token:accessToken})
            }
            
        }
    }
}


async function token_refresh(req,res){
    const cookie = req.cookies['jwt']
    if(!cookie){
        return res.status(400).json({"message":"Not authorized, Sign In"})
    }else{
        token = cookie
        user = await Users.findOne({refreshToken:token})
        if(!user){
            return res.status(400).json({"message":"Not authorized, Sign In"})
        }
        value = await jwt.decode(token, process.env.REFRESH_TOKEN_SECRET)
        if(value.id!=user.id){
            return res.status(400).json({"message":"Invalid Credentials"})
        }
        accessToken = jwt.sign({id:user.id, role:user.role},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
        return res.status(200).json({token:accessToken});
    }
}


async function updatePassword(req,res){
    oldPassword = req.body.oldPassword;
    newPassword = req.body.newPassword;
    if(oldPassword && newPassword){
        user = await Users.findById(req.params.id).select('+password')
        if(!user){
            return res.status(404).json({msg:"User Not Found"})
        }
        hashedOldPassword = await bcrypt.compare(oldPassword,user.password); 
            if(hashedOldPassword){
                hash = await bcrypt.hash(newPassword,salt)
                data = {password:hash}
                Users.findByIdAndUpdate(req.params.id, data, {new:true},(err,user)=>{
                if (err){
                    console.log(err) 
                    return res.status(400).json({msg:"Could not update the password"});
                } ;
                return res.status(201).json({msg:"password updated successfully", data:user})
                })
            }else{
                return res.status(400).json({msg:"Invalid credentials"})
            }
            
    }else{
        return res.status(400).json({msg:"Invalid credentials"})
    }
}


async function getUser(req,res){
    Users.findById(req.params.id,(err,data)=>{
        if (err){
            console.log(err)
            return res.status(404).json("User not found")
        }
        if(!data){
            return res.status(404).json({msg:"User not found"})
        }
        return res.status(200).json(data)
    })
}

async function updateUser(req,res){
    data = req.body
    delete data.password
    Users.findByIdAndUpdate(req.params.id,data,{new:true}, (err, data)=>{
        if(err){
            console.log(err)
            return res.status(400).json({msg:"User could not be updated"})
        }
        return res.status(200).json(data)
    })
}


async function deleteUser(req,res){
    Users.findByIdAndDelete(req.params.id,(err, data)=>{
        if (err){
            console.log(err)
            return res.status(400).json({msg:"User could not be deleted"})
        }
        return res.status(200).json({msg:"User deleted successfully",data:data})
    })
}


module.exports = {getAllUsers, createUser, loginUser, token_refresh, updatePassword, getUser, updateUser, deleteUser}