import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import User from "../../models/user.js";
import JwtService from "../../services/JWTSevice.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import RefreshToken from "../../models/refreshToken.js";


const registerController = async (req, res, next) => {


    // validation
    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        repeat_password: Joi.ref("password")
    });

    // console.log(req.body);

    const { error } = registerSchema.validate(req.body);

    if (error) {
        // res.json({});
        // console.error(error.details);
        return next(error);
    }


    // check if user is in the database already
    try {
        const exist = await User.exists({ email: req.body.email });
        if (exist) {
            return next(CustomErrorHandler.alreadyExist("This email is already taken."));
        };
    } catch (error) {
        return next(error);
    };

    const { name, email, password } = req.body;
    // Hash Password    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the model
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword
    });

    let access_token;
    let refresh_token;

    try {
        const result = await user.save();

        // console.log(result);

        // Token
        access_token = JwtService.sign({ _id: result._id, role: result.role });
        refresh_token = JwtService.sign({ _id: result._id, role: result.role }, "1y", process.env.REFRESH_SECRET);
        // Database whitelist
        await RefreshToken.create({ token: refresh_token });


    } catch (error) {
        return next(error);
    }



    res.json({
        access_token: access_token,
        refresh_token: refresh_token
    });
};

export default registerController;