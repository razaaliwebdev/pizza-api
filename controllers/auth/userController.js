import User from "../../models/user";


const userController = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
};


export default userController;