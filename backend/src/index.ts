import cors from "cors";
import express from "express";
import path from "path";
import axios from "axios";
import zod from "zod";
import { Order,Product } from "./db";
import dotenv from "dotenv";
dotenv.config();

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY as string;

const app = express();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const getOrdersSchema = zod.object({
    phone: zod.string().refine(value => value.length === 10 && /^\d+$/.test(value), {
        message: "Phone number must be a 10-digit numeric string"
    })
});


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

interface ProductDetails {
    id: number;
    product_id: number;
    title: string;
    sku: string;
    quantity: number;
    images: string[] | null;
}


interface LineItem {
    id: number;
    product_id: number;
    quantity: number;
    sku: string;
}

interface Refund {
    refund_line_items: RefundLineItem[];
}

interface RefundLineItem {
    line_item_id: number;
    quantity: number;
}

type VerificationResult = zod.infer<typeof getOrdersSchema>;

interface OrderRequest {
    _id: string;
    id: number;
    order_number: number;
    phone: string;
    products: ProductDetails[];
    cancelled: boolean;
    price: string;
    created_at: string;
    financial_status: string;
    fullfilment_status: string;
}

const __dirname1 = path.resolve();
console.log("17", path.resolve(__dirname, "../../frontend", "dist", "index.html"))

if (true) {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  
  app.get("/api/healthcheck", function(req,res){
    res.json({ status: 'ok' })
  
  })
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"))
  );  
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.post("/getOrders", async (req, res) => {
    console.log("req.body", req.body)
    const verificationResult = getOrdersSchema.safeParse(req.body);
    if (!verificationResult.success) {
        return res.status(400).json({ message: "Invalid data provided." });
    }

    const orders: OrderRequest[] = await Order.find({ phone: verificationResult.data.phone });
    if (orders.length > 0) {
        res.json(orders);
    } else {
        res.status(404).json({ message: "No orders found for this phone number." });
    }
});

app.post("/getOrderDetails", async (req, res) => {
    const orderNo = req.body.order_number;

    const OrderDetails : OrderRequest | null = await Order.findOne({ order_number: orderNo });
    
    if (OrderDetails !== null) {
        const { products } = OrderDetails;

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const productDetails = await Product.findOne({ product_id: product.id });
                return {
                    ...product,
                    images: productDetails?.images || null
                };
            })
        );
    
        OrderDetails.products = updatedProducts;
    
        res.json(OrderDetails);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});
