const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 443;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock API Response
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the mock server!" });
});

// Set up file upload using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});

// Default route
app.get("/", (req, res) => {
    res.send("Mock server running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For Vercel deployment
