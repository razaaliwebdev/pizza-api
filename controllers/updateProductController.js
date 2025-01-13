import productSchema from "../validators/productValidators.js";



const updateProductController = async (req, res, next) => {
    handleMultiPartData(req, res, async (err) => {
        if (err) {
            // Pass error to the next middleware
            return next(err);
        }

        // If no file uploaded, throw error
        if (!req.file) {
            return next(CustomErrorHandler.badRequest("No file uploaded"));
        };

        let filePath;
        if (req.file) {
            // File path after upload
            filePath = req.file.path;
        };



        // Validation schema for the product
        // const productSchema = Joi.object({
        //     name: Joi.string().required(),
        //     price: Joi.number().required(),
        //     size: Joi.string().required(),
        // });

        const { error } = productSchema.validate(req.body); // Validate the product data

        if (error) {
            // Delete the uploaded file on validation error
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err}`);
                }
            });
            return next(error); // Pass validation error to the next middleware
        }

        const { name, price, size } = req.body;

        const product = new Product({
            name,
            price,
            size,
            image: filePath,
        });

        // Save the product to the database
        await product.save();

        // Respond with the created product
        res.status(201).json(product);
    });
};


export default updateProductController;