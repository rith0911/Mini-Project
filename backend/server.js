import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from './routes/group.routes.js';
import eventRoutes from './routes/event.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import newsRoutes from './routes/news.routes.js';
import projectRoutes from './routes/project.routes.js';
import departmentRoutes from './routes/department.routes.js';
import postRoutes from './routes/post.routes.js';
import connectionRoutes from "./routes/connection.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";
import notificationRoutes from './routes/notification.route.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/mentorship', mentorRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connection', connectionRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
});