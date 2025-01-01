import orderModel from "../models/order.model.js";
import userModel from '../models/user.model.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Global varibales
const currency =  "PKR";
const deliveryCharges = 250;

const placeOrder = async(req, res) =>{

    const frontendUrl = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, {cartData:  {cartData:{}}});

        const line_items = req.body.items.map((item)=>({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "PKR",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharges * 100 * 275
            },
            quantity :1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({success: true, session_url: session.url});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
        
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if(success == 'true'){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            res.json({success: true, message: "Paid"});
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false, message: "Not Paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
        
    }
}

// User orders for frontend
const userOrders = async(req, res) => {

    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}
// Admin panel

const listOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
        
    }
}

// Update order status
const updateStatus = async(req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success: true, message: "Status Updated"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
        
    }
}


export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrder,
    updateStatus,
}