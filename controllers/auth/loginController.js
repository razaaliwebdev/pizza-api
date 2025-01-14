import Joi from 'joi';
import "dotenv/config";
import User from '../../models/user.js';
import RefreshToken from '../../models/refreshToken.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import bcrypt from 'bcrypt';
import JwtService from '../../services/JWTSevice.js';


const loginController = async (req, res, next) => {

    // validation
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
        return next(error);
    };

    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return next(CustomErrorHandler.wrongCredentials());
        };

        // compare the password
        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            return next(CustomErrorHandler.wrongCredentials());
        }


        // Token
        const access_token = JwtService.sign({ _id: user._id, role: user.role });
        const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, "1y", process.env.REFRESH_SECRET);
        // Database whitelist
        await RefreshToken.create({ token: refresh_token });


        res.json({ access_token,refresh_token });

    } catch (error) {
        return next(error);
    }

};

export default loginController;