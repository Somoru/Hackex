import express from "express";
import multer from "multer";
import fs from "fs";
import { uploadToOneDrive } from "../services/onedriveService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Upload file to OneDrive
        const oneDriveUrl = await uploadToOneDrive(req.file.path, req.file.originalname);

        // Delete the file from local storage after upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: "File uploaded successfully!", url: oneDriveUrl });
    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ message: "Failed to upload file." });
    }
});

export default router;
