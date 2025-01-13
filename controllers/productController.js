
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import productSchema from "../validators/productValidators.js";
import Product from "../models/product.js";
import multer from 'multer';
import path from "path";
import Joi from 'joi';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName); // Naming the uploaded file
  },
});

const handleMultiPartData = multer({
  storage,
  limits: { fileSize: 1000000 * 30 } // File size limit: 30MB
}).single("image");

const productController = async (req, res, next) => {
  try {
    // Handling file upload with multer
    handleMultiPartData(req, res, async (err) => {
      if (err) {
        // Pass error to the next middleware
        return next(err);
      }
      
      // If no file uploaded, throw error
      if (!req.file) {
        return next(CustomErrorHandler.badRequest("No file uploaded"));
      }

      // File path after upload
      const filePath = req.file.path;

      // Validation schema for the product
      // const productSchema = Joi.object({
      //   name: Joi.string().required(),
      //   price: Joi.number().required(),
      //   size: Joi.string().required(),
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
  } catch (error) {
    // Handle other errors
    return next(error);
  }
};

export default productController;
