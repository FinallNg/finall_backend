const jwt = require('jsonwebtoken');
const {Users} = require('../models/users');
const {Admins} = require('../models/admin');

exports.authorizeUser = async (req,res, next)=>{
    try {
        const token = req.cookies['jwt'] || req.headers?.authorization?.split(' ')[1]
        if(!token || undefined){
            return res.status(401).json({msg:"Unauthorized, Sign In!"});
        }else{
            const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await Users.findById(verified.id);
            if(!user){
                return res.status(403).json({msg:"Invalid Token"})
            }else{
                req.user = verified;
                next();
            }
        }   
    } catch (error) {
        console.error(error)
        return res.status(500).json({success:false, msg:"An Error Occured"})
    }
    
}


exports.authorizeAdmin = async (req,res, next)=>{
    try {
        const token = req.cookies['jwt'] || req.headers?.authorization?.split(' ')[1]
        if(!token || undefined){
            return res.status(401).json({msg:"Unauthorized, Sign In!"});
        }else{
            const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if (!verified.is_admin){
                return res.status(400).json({msg:"You don't have the required permission"})
            }else{
                req.user = verified;
                console.log(req.user)
                next();
            }
            
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({success:false, msg:"An Unknown Error Occured!"})
    }
    
}