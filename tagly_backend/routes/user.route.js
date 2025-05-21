import { Router } from "express";
import { getUser, refreshTokenRoute, updateProfile, userLogin, userLogout, userRegistration, verifyOtp } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRoutes = Router();

userRoutes.post("/reg", userRegistration)
userRoutes.get("/refresh-token", refreshTokenRoute)
userRoutes.post("/logout", authMiddleware, userLogout)
userRoutes.post("/login", userLogin)
userRoutes.post("/otp", verifyOtp)
userRoutes.get("/user/:_id", authMiddleware, getUser);
userRoutes.put("/edit/:_id", authMiddleware, upload.single("profilePicture"), updateProfile);

export default userRoutes;
