import Joi from 'joi';
import RefreshToken from '../../models/refreshToken.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import JwtService from '../../services/JWTSevice.js';
import "dotenv/config";
import User from '../../models/user.js';

const refreshController = async (req, res, next) => {

    // validation
    const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
        return next(error);
    };

    // Check in database
    let refreshToken;
    try {
        refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });
        if (!refreshToken) {
            return next(CustomErrorHandler.unAuthorized("Invalid refresh token "));
        }

        let userId;
        try {
            const { _id } = await JwtService.verify(refreshToken.token, process.env.REFRESH_SECRET);
            userId = _id;
        } catch (error) {
            return next(new Error("Something went wrong" + error.message));
        }

        const user = User.findOne({ _id: userId });

        if (!user) {
            return next(CustomErrorHandler.unAuthorized("No user found"));
        };

        // Token
        const access_token = JwtService.sign({ _id: user._id, role: user.role });
        const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, "1y", process.env.REFRESH_SECRET);
        // Database whitelist
        await RefreshToken.create({ token: refresh_token });


        res.json({ access_token, refresh_token });

    } catch (error) {
        return next(new Error("Something went wrong" + error.message));
    }



};

export default refreshController;
