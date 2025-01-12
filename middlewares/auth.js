import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JWTSevice.js";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    // console.log(authHeader);

    const token = authHeader.split(" ")[1];

    try {
        const { _id, role } = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        req.user._id = _id;
        req.user.role = role;
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }

};

export default auth;
