const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://pres:MM5QMJP6kKH4oPyS@cluster0.hjwww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Mongoose schema and model
const listingSchema = new mongoose.Schema({
  img_name: { type: String, required: true },
  price: { type: String, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  sqft: { type: Number, required: true },
  address: { type: String, required: true },
  features: [{ type: String }],
  year_built: { type: Number, required: true },
  property_type: {
    type: String,
    required: true,
    enum: ["Single-Family Home", "Townhouse", "Condo", "Apartment", "Other"],
  },
  listing_status: {
    type: String,
    required: true,
    enum: ["For Sale", "Sold", "Pending", "Off Market"],
  },
});

const Listing = mongoose.model("Listing", listingSchema);

// Validation schema with Joi
const listingValidationSchema = Joi.object({
  price: Joi.string().required(),
  beds: Joi.number().integer().required(),
  baths: Joi.number().integer().required(),
  sqft: Joi.number().integer().required(),
  address: Joi.string().required(),
  features: Joi.array().items(Joi.string()).required(),
  year_built: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  property_type: Joi.string()
    .valid("Single-Family Home", "Townhouse", "Condo", "Apartment", "Other")
    .required(),
  listing_status: Joi.string()
    .valid("For Sale", "Sold", "Pending", "Off Market")
    .required(),
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get all listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to fetch listings" });
  }
});

// Add a new listing
app.post("/api/listings", upload.single("image"), async (req, res) => {
  const { error } = listingValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  const newListing = new Listing({
    img_name: req.file ? `/images/${req.file.filename}` : "images/default.jpg",
    price: req.body.price,
    beds: parseInt(req.body.beds, 10),
    baths: parseInt(req.body.baths, 10),
    sqft: parseInt(req.body.sqft, 10),
    address: req.body.address,
    features: req.body.features.split(",").map((f) => f.trim()),
    year_built: parseInt(req.body.year_built, 10),
    property_type: req.body.property_type,
    listing_status: req.body.listing_status,
  });

  try {
    const savedListing = await newListing.save();
    res.status(201).send({ success: true, listing: savedListing });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to save listing" });
  }
});

// Update a listing
app.put("/api/listings/:id", async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!updatedListing) {
      return res.status(404).send({ success: false, message: "Listing not found" });
    }
    res.send({ success: true, listing: updatedListing });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to update listing" });
  }
});

// Delete a listing
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params._id);
    if (!deletedListing) {
      return res.status(404).send({ success: false, message: "Listing not found" });
    }
    res.send({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).send({ success: false, message: "Failed to delete listing" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Listening on port 3001...");
});

