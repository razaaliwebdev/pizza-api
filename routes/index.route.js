import express from 'express';
import registerController from "../controllers/auth/registerController.js"
import loginController from '../controllers/auth/loginController.js';
import userController from '../controllers/auth/userController.js';
import auth from '../middlewares/auth.js';
import refreshController from '../controllers/auth/refreshController.js';
import logoutController from '../controllers/auth/logoutController.js';
import productController from '../controllers/productController.js';
import admin from '../middlewares/admin.js';
import updateProductController from '../controllers/updateProductController.js';


const router = express.Router();


// Register route
router.post("/register", registerController);

// Login route
router.post("/login", loginController);

// Me route
router.get("/me", auth, userController);

// Refresh token
router.post("/refresh", refreshController);

// Logout 
router.post("/logout", auth, logoutController)

// All products
router.post("/products", [auth, admin], productController);

// Update the products
router.put("/products", [auth, admin], updateProductController);




export default router;