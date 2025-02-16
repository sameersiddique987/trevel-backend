const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const flightsRoutes = require("./routes/flightsRoutes");
const authRoutes = require("./routes/authRoutes");
const popupRoutes = require("./routes/popupRoutes");
const queryRoutes = require("./routes/queryRoutes");
const agentRoutes = require("./routes/agentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const calendarEventRoutes = require("./routes/calendarEventRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
app.use("/invoices", express.static(path.join(__dirname, "invoices"))); 

//  CORS Configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//  Multer Storage 
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, "popup-image" + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//  Multer Storage 
const invoiceStorage = multer.diskStorage({
  destination: path.join(__dirname, "invoices"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadInvoice = multer({ storage: invoiceStorage });

//  Health Check Route
app.get("/", (req, res) => {
  res.send("Hello world");
});

//  API Routes
app.use("/api/flights", flightsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/popup", popupRoutes);
app.use("/api", queryRoutes);
app.use("/api", agentRoutes);
app.use("/api", bookingRoutes);
app.use("/api", calendarEventRoutes);
app.use("/api", invoiceRoutes);

//  API to Upload Popup Image
app.post("/api/upload-popup", upload.single("popupImage"), (req, res) => {
  res.json({ imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` });
});

// API to Fetch Latest Popup Image
app.get("/api/get-popup", (req, res) => {
  res.json({ imageUrl: `${req.protocol}://${req.get("host")}/uploads/popup-image.jpg` });
});

//  API to Upload Invoice
app.post("/api/upload-invoice", uploadInvoice.single("invoice"), (req, res) => {
  res.json({ invoiceUrl: `${req.protocol}://${req.get("host")}/invoices/${req.file.filename}` });
});

//  Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully!"))
  .catch((err) => console.error(" Database Connection Error:", err));

// Start the Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
