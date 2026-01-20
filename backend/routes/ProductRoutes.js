const express = require("express").Router();
const authGuard = require("../helpers/authguard");
const roleGuard = require("../helpers/roleGuard");

const { 
    addProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/ProductControllers");

// Public routes - anyone can view products
express.get("/getAllProducts", getAllProducts);
express.get("/getProduct/:id", getProductById);

// Admin and Dentist only routes - manage products
express.post("/addProduct", authGuard, roleGuard('admin', 'dentist'), addProduct);
express.put("/updateProduct/:id", authGuard, roleGuard('admin', 'dentist'), updateProduct);
express.delete("/deleteProduct/:id", authGuard, roleGuard('admin'), deleteProduct);


module.exports = express;