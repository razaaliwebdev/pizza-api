import express from 'express';
import registerController from "../controllers/auth/registerController.js"
import loginController from '../controllers/auth/loginController.js';


const router = express.Router();


// Register route
router.post("/register",registerController);

// Login route
router.post("/login",loginController);





export default router;