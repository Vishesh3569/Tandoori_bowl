import mongoose from "mongoose";
import dotenv from "dotenv";
import { MenuItem } from "../models/MenuItem";

dotenv.config();

const items = [
  // --- DRIP ROLLS (From Drip Roll Menu) ---
  {
    name: "Malai Chaap Drip Roll",
    category: "drip_roll",
    price: 239,
    description: "Tender soya chaap marinated in rich malai marinade, layered with onions and topped with decadent white cream dip.",
    tagline: "Creamy Rich Irresistible",
    badge: "THE OG",
    imageUrl: "/images/rolls/malai-chaap.png",
    isVeg: true,
  },
  {
    name: "Masala Chaap Drip Roll",
    category: "drip_roll",
    price: 239,
    description: "Char-grilled soya chaap dunked in fiery tandoori masala gravy, sliced onions, and signature dipping sauce.",
    tagline: "Bold Spicy Full Of Flavour",
    badge: "CHEF'S SPECIAL",
    imageUrl: "/images/rolls/masala-chaap.png",
    isVeg: true,
  },
  {
    name: "Cheese Chaap Drip Roll",
    category: "drip_roll",
    price: 279,
    description: "Soya chaap roll loaded with molten liquid cheese blend, aromatic tandoori seasoning, and house garlic sauce.",
    tagline: "Cheesy Indulgent Next Level",
    badge: "BESTSELLER",
    imageUrl: "/images/rolls/cheese-chaap.png",
    isVeg: true,
  },

  // --- BURGERS (From Hand Menu) ---
  {
    name: "The OG Cheese Drip Burger",
    category: "burger",
    price: 249,
    description: "Juicy, cheesy burger loaded with creamy tandoori cheese sauce, sprinkled with fried onion, and fused with crispy nachos.",
    tagline: "Same Burger. A Lot More Cheese.",
    badge: "TANDOORI BOWL EXCLUSIVE",
    imageUrl: "/images/burgers/cheese-drip-burger.png",
    isVeg: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/tandoori_bowl");
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(items);
    console.log("Database seeded with Tandoori Bowl menu items successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();