const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();
const multer = require('multer');
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.json());  
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/'); // Save files to 'public/uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });


const listings = [
  {
    _id: 1,
    img_name: "images/house.jpeg",
    price: "$400,000",
    beds: 3,
    baths: 2,
    sqft: 2000,
    address: "123 Maple St, Springfield, IL, 62704",
    features: ["Fireplace", "Large Backyard", "Granite Countertops"],
    year_built: 2010,
    property_type: "Single-Family Home",
    listing_status: "For Sale",
  },
  {
    _id: 2,
    img_name: "images/house2.jpg",
    price: "$330,000",
    beds: 2,
    baths: 2,
    sqft: 1750,
    address: "9876 Spruce Ln, Columbia, SC, 29203",
    features: ["New Roof", "Updated Kitchen", "Built-in Bookshelves"],
    year_built: 2012,
    property_type: "Townhouse",
    listing_status: "For Sale",
  },
  {
    _id: 3,
    img_name: "images/house3.jpg",
    price: "$500,000",
    beds: 4,
    baths: 3,
    sqft: 2500,
    address: "456 Oak St, Denver, CO, 80204",
    features: ["Swimming Pool", "Solar Panels", "Hardwood Floors"],
    year_built: 2015,
    property_type: "Single-Family Home",
    listing_status: "Pending",
  },
  {
    _id: 4,
    img_name: "images/house4.jpg",
    price: "$275,000",
    beds: 2,
    baths: 1,
    sqft: 1200,
    address: "789 Pine St, Portland, OR, 97202",
    features: ["Patio", "New HVAC System", "Corner Lot"],
    year_built: 2005,
    property_type: "Condo",
    listing_status: "For Sale",
  },
  {
    _id: 5,
    img_name: "images/house5.jpg",
    price: "$650,000",
    beds: 5,
    baths: 4,
    sqft: 3200,
    address: "321 Birch Ave, Austin, TX, 73301",
    features: ["3-Car Garage", "Game Room", "Custom Lighting"],
    year_built: 2018,
    property_type: "Single-Family Home",
    listing_status: "Sold",
  },
  {
    _id: 6,
    img_name: "images/house0.jpg",
    price: "$350,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    address: "789 Willow Dr, Seattle, WA, 98101",
    features: ["Deck", "Finished Basement", "Updated Bathrooms"],
    year_built: 2010,
    property_type: "Townhouse",
    listing_status: "For Sale",
  },
  {
    _id: 7,
    img_name: "images/house3.jpg",
    price: "$425,000",
    beds: 4,
    baths: 3,
    sqft: 2100,
    address: "345 Cedar Ln, Miami, FL, 33101",
    features: ["Waterfront", "Open Floor Plan", "High Ceilings"],
    year_built: 2020,
    property_type: "Single-Family Home",
    listing_status: "Pending",
  },
  {
    _id: 8,
    img_name: "images/house5.jpg",
    price: "$275,000",
    beds: 2,
    baths: 1,
    sqft: 1300,
    address: "678 Poplar Rd, Atlanta, GA, 30301",
    features: ["Hardwood Floors", "Updated Kitchen", "Fenced Yard"],
    year_built: 2005,
    property_type: "Condo",
    listing_status: "For Sale",
  },
];

const listingSchema = Joi.object({
  price: Joi.string().required(),
  beds: Joi.number().integer().required(),
  baths: Joi.number().integer().required(),
  sqft: Joi.number().integer().required(),
  address: Joi.string().required(),
  features: Joi.array().items(Joi.string()).required(),
  year_built: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  property_type: Joi.string()
    .valid('Single-Family Home', 'Townhouse', 'Condo', 'Apartment', 'Other')
    .required(),
  listing_status: Joi.string()
    .valid('For Sale', 'Sold', 'Pending', 'Off Market')
    .required(),
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.post("/api/listings", upload.single('image'), (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Uploaded file:", req.file);

  // Validate incoming data
  const { error } = listingSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.message);
    return res.status(400).send({ success: false, message: error.message });
  }

  // Create a new listing with default values for any missing fields
  const newListing = {
    _id: listings.length + 1,
    img_name: req.file ? `/uploads/${req.file.filename}` : 'images/default.jpg',
    price: req.body.price,
    beds: parseInt(req.body.beds, 10),
    baths: parseInt(req.body.baths, 10),
    sqft: parseInt(req.body.sqft, 10),
    address: req.body.address,
    features: req.body.features || [],
    year_built: parseInt(req.body.year_built, 10) || 2000,
    property_type: req.body.property_type,
    listing_status: req.body.listing_status || 'For Sale',
  };

  // Add the new listing to the in-memory listings array
  listings.push(newListing);

  // Log the added listing for debugging
  console.log("New listing added:", newListing);

  // Send a success response with the new listing
  res.status(201).send({ success: true, listing: newListing });
});

const updateSchema = Joi.object({
  price: Joi.string().required(),
  address: Joi.string().required(),
}).required();


app.put("/api/listings/:id", (req, res) => {
  const listingId = parseInt(req.params.id, 10);

  // Validate request body with updateSchema
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  const listingIndex = listings.findIndex((listing) => listing._id === listingId);
  if (listingIndex === -1) {
    return res.status(404).send({ success: false, message: "Listing not found" });
  }

  // Update only the fields submitted in the request
  listings[listingIndex] = { ...listings[listingIndex], ...req.body };

  res.status(200).send({ success: true, listing: listings[listingIndex] });
});


app.listen(3001, () => {
  console.log("Listening....");
});

