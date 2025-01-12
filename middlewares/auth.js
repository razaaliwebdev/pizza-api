
const auth = (req,res,next)=>{
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader){
        return next(error);
    }
};

export default auth;
