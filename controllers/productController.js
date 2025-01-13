import Product from "../models/product.js";
import multer from 'multer';
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => (null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 34567654-34567.png
        cb(null, uniqueName);
    },
});

const handleMultiPartData = multer({ storage, limits: { fileSize: 1000000 * 30 } }).single("image"); // 5mb


const productController = async (req, res, next) => {

    // Multipart form data

    handleMultiPartData(req, res, (error) => {
        if (error) {
            return next(CustomErrorHandler.serverError());
        };
        console.log(req.file)
        // const filePath = req.file.path;

        res.json({});
    });


};

export default productController;
