const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Popup = require("../models/Popup"); // MongoDB Schema

const router = express.Router();

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to upload image
router.post("/upload", upload.single("popupImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Save the image path in MongoDB
  const popup = new Popup({ imageUrl: `/uploads/${req.file.filename}` });
  await popup.save();

  res.json({ message: "Image uploaded successfully", imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Route to get latest popup image
router.get("/get-popup", async (req, res) => {
  const latestPopup = await Popup.findOne().sort({ createdAt: -1 });

  if (!latestPopup) {
    return res.status(404).json({ error: "No popup found" });
  }

  res.json({ imageUrl: `http://localhost:5000${latestPopup.imageUrl}` });
});

module.exports = router;