const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();
app.use(cors());
app.use(express.static("public"));


const listings = [
    {
        "_id": 1,
        "img_name": "images/house0.jpg",
        "price": "$400,000",
        "description": "3 bds | 2 ba | 2,200 sqft",
        "address": "1234 Oak St, Columbia, SC, 29203",
        "features": [
          "Garage",
          "Backyard",
          "Fireplace"
        ],
        "year_built": 2005,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 2,
        "img_name": "images/house.jpeg",
        "price": "$535,000",
        "description": "4 bds | 3 ba | 3,100 sqft",
        "address": "5678 Pine Ave, Columbia, SC, 29203",
        "features": [
          "Swimming Pool",
          "Patio",
          "Modern Kitchen"
        ],
        "year_built": 2010,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 3,
        "img_name": "images/house2.jpg",
        "price": "$315,000",
        "description": "2 bds | 1.5 ba | 1,600 sqft",
        "address": "910 Birch Rd, Columbia, SC, 29203",
        "features": [
          "Open Floor Plan",
          "Granite Countertops",
          "Hardwood Floors"
        ],
        "year_built": 2000,
        "property_type": "Townhouse",
        "listing_status": "For Sale"
      },
      {
        "_id": 4,
        "img_name": "images/house3.jpg",
        "price": "$390,000",
        "description": "3 bds | 2 ba | 2,050 sqft",
        "address": "4321 Elm St, Columbia, SC, 29203",
        "features": [
          "Finished Basement",
          "Walk-in Closet",
          "Energy-efficient Windows"
        ],
        "year_built": 2008,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 5,
        "img_name": "images/house4.jpg",
        "price": "$315,000",
        "description": "2 bds | 1 ba | 1,400 sqft",
        "address": "7890 Maple Dr, Columbia, SC, 29203",
        "features": [
          "Fenced Yard",
          "Stainless Steel Appliances",
          "Renovated Bathroom"
        ],
        "year_built": 1995,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 6,
        "img_name": "images/house5.jpg",
        "price": "$405,000",
        "description": "3 bds | 2 ba | 1,850 sqft",
        "address": "6789 Cedar Blvd, Columbia, SC, 29203",
        "features": [
          "Sunroom",
          "Large Backyard",
          "2-Car Garage"
        ],
        "year_built": 2003,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 7,
        "img_name": "images/house0.jpg",
        "price": "$500,000",
        "description": "4 bds | 3 ba | 2,500 sqft",
        "address": "3456 Palm St, Columbia, SC, 29203",
        "features": [
          "Private Deck",
          "Fire Pit",
          "In-law Suite"
        ],
        "year_built": 2015,
        "property_type": "Single-family",
        "listing_status": "For Sale"
      },
      {
        "_id": 8,
        "img_name": "images/house2.jpg",
        "price": "$330,000",
        "description": "2 bds | 2 ba | 1,750 sqft",
        "address": "9876 Spruce Ln, Columbia, SC, 29203",
        "features": [
          "New Roof",
          "Updated Kitchen",
          "Built-in Bookshelves"
        ],
        "year_built": 2012,
        "property_type": "Townhouse",
        "listing_status": "For Sale"
      }
];

const listingSchema = Joi.object({
  img_name: Joi.string().required(),
  price: Joi.string().required(),
  description: Joi.string().required(),
  address: Joi.string().required(),
  features: Joi.array().items(Joi.string()).required(),
  year_built: Joi.number().integer().min(1800).required(),
  property_type: Joi.string().required(),
  listing_status: Joi.string().required(),
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/listings", (req, res) => {
  res.json(listings);
});

app.post("/api/listings", (req, res) => {
  const { error } = listingSchema.validate(req.body);
  if (error) return res.status(400).send({ success: false, message: error.message });

  const newListing = { ...req.body, _id: listings.length + 1 };
  listings.push(newListing);
  res.status(201).send({ success: true, listing: newListing });
});

app.listen(3001, () => {
  console.log("Listening....");
});