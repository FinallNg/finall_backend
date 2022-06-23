const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admins } = require('../models/admin');
const {adminValidation, loginValidation} = require('../validations/admin.validation.js');
require('dotenv').config()
const salt = parseInt(process.env.SALT);

async function getAllAdmins(req,res){
    const admins= await Admins.find()
    return res.status(200).json(admins)
}

async function createAdmin(req,res){
    const data = req.body
    const {error, value} = await adminValidation(data)
    if (error){
        return res.status(400).json({msg:error.details[0].message})
    }
    else{
        admin_exists = await Admins.findOne({email: value.email})
        if(admin_exists){
            return res.status(400).json({"message":"email already exists"})
        }else{
            hashedPassword = await bcrypt.hash(value.password,salt);
            value.password = hashedPassword;
            const admin = new Admins(value)
            refreshToken = jwt.sign({id:admin.id, role:admin.role},process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})
            accessToken = jwt.sign({id:admin.id, role:admin.role},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
            admin.refreshToken = refreshToken
            admin.save()
            return res.cookie('jwt',refreshToken, {httpOnly:true, maxAge:24*60*60*1000, sameSite:'None', secure:true}).status(201).json({msg:"Admin Created Successfully", data:admin, "token":accessToken});
        }
    }
}

async function loginAdmin(req,res){
    const data = req.body
    const {error, value} = await loginValidation(data)
    if (error){
        return res.status(400).json({msg:error.details[0].message})
    }
    else{
        admin_exists = await Admins.findOne({email: value.email}).select('+password');
        if(!admin_exists){
            return res.status(400).json({"message":"Invalid Credentials"})
        }else{
            password = await bcrypt.compare(value.password, admin_exists.password)
            if(!password){
                return res.status(400).json({"message":"Invalid Credentials"})
            }else{
                refreshToken = jwt.sign({id:admin_exists.id, role:admin_exists.role},process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'})
                accessToken = jwt.sign({id:admin_exists.id, role:admin_exists.role},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
                admin_exists.refreshToken = refreshToken
                admin_exists.save()
                return res.cookie('jwt',refreshToken, {httpOnly:true, maxAge:24*60*60*1000, sameSite:'None'}).status(200).json({"message":"Log In Successful", data:admin_exists, token:accessToken})
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
        admin = await Admins.findOne({refreshToken:token})
        if(!admin){
            return res.status(400).json({"message":"Not authorized, Sign In"})
        }
        value = await jwt.decode(token, process.env.REFRESH_TOKEN_SECRET)
        if(value.id!=admin.id){
            return res.status(400).json({"message":"Invalid Credentials"})
        }
        accessToken = jwt.sign({id:admin.id, is_super_admin:admin.is_super_admin},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15m'})
        return res.status(200).json({token:accessToken});
    }
}


async function updatePassword(req,res){
    oldPassword = req.body.oldPassword;
    newPassword = req.body.newPassword;
    if(oldPassword && newPassword){
        admin = await Admins.findById(req.params.id).select('+password')
        if(!admin){
            return res.status(404).json({msg:"Admin Not Found"})
        }
        hashedOldPassword = await bcrypt.compare(oldPassword,admin.password); 
            if(hashedOldPassword){
                hash = await bcrypt.hash(newPassword,salt)
                data = {password:hash}
                Admins.findByIdAndUpdate(req.params.id, data, {new:true},(err,admin)=>{
                if (err){
                    console.log(err) 
                    return res.status(400).json({msg:"Could not update the password"});
                } ;
                return res.status(201).json({msg:"password updated successfully", data:admin})
                })
            }else{
                return res.status(400).json({msg:"Invalid credentials"})
            }
            
    }else{
        return res.status(400).json({msg:"Invalid credentials"})
    }
}


async function getAdmin(req,res){
    Admins.findById(req.params.id,(err,data)=>{
        if (err){
            console.log(err)
            return res.status(404).json("Admin not found")
        }
        if(!data){
            return res.status(404).json({msg:"Admin not found"})
        }
        return res.status(200).json(data)
    })
}

async function updateAdmin(req,res){
    data = req.body
    delete data.password
    delete data.is_super_admin
    Admins.findByIdAndUpdate(req.params.id,data,{new:true}, (err, data)=>{
        if(err){
            console.log(err)
            return res.status(400).json({msg:"Admin could not be updated"})
        }
        return res.status(200).json(data)
    })
}


async function deleteAdmin(req,res){
    Admins.findByIdAndDelete(req.params.id,(err, data)=>{
        if (err){
            console.log(err)
            return res.status(400).json({msg:"Admin could not be deleted"})
        }
        return res.status(200).json({msg:"Admin deleted successfully",data:data})
    })
}


module.exports = {getAllAdmins, createAdmin, loginAdmin, token_refresh, updatePassword, getAdmin, updateAdmin, deleteAdmin}