import mongoose from "mongoose";
import dotenv from "dotenv";
import { number } from "zod";

dotenv.config();

const MONGO_URI  : string = process.env.MONGO_URI as string;

const connectDB = async () => {
    try {
      await mongoose.connect(
        MONGO_URI
      );
      console.log("MongoDB connection SUCCESS");
    } catch (error) {
      console.error("MongoDB connection FAIL", error);
      process.exit(1);
    }
  };

connectDB();

const orderSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    order_number: { type: Number, required: true },
    phone: { type: String, required: true },
    products : { type: Array, required: true },
    price : { type: Number, required: true },
    cancelled : { type: String, required: true },
});
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  price: { type: Number, required: true },
  sku: { type: String, required: true },
  product_id: { type: Number, required: true },
  images : { type: Array, required: true },
  title : { type: String, required: true },
});


export const Order = mongoose.model("Order", orderSchema);
export const Product = mongoose.model("Product", productSchema);