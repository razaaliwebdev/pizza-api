import Joi from "joi"; 
 
 
 
 // Validation schema for the product
 const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
});

export default productSchema;