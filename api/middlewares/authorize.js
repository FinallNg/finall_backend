exports.authorize = async (req,res, next)=>{
    try {
        const cookie = req.cookies['jwt']
        if(!cookie){
            return res.status(403).json({msg:"Unauthorized, Sign In!"});
        }else{
            const verified = await jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET)
            req.user = verified;
            next();
        }   
    } catch (error) {
        return res.status(403).json({success:false, msg:"Acess denied, Sign In!"})
    }
    
}