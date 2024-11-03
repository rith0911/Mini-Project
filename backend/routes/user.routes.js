import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, getSuggestedUsers, updateUser,updateProfile } from "../controllers/user.controller.js";

const  router = express.Router();

router.get("/profile/:rollnumber",protectRoute, getUserProfile);
router.get("/suggested", protectRoute , getSuggestedUsers);
//router.post("/follow/:id",protectRoute , followUnfollowUser);
router.post("/update",protectRoute , updateUser);
//router.post('/connect/:id',protectRoute, connecting );
//router.get("/connections",protectRoute,connectionReq);
router.post('/updatep', protectRoute, updateProfile);

export default router;