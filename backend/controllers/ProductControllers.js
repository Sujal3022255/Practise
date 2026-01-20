const Product = require("../models/productModel.js");

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        if (!name || !price) {
            return res.status(400).json({
                message: "Name and price are required."
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category
        });

        res.status(201).json({
            message: "Product created successfully.",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding product",
            error: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({
            message: "Products retrieved successfully.",
            products
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving products",
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product retrieved successfully.",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving product",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.update({
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
            category: category || product.category
        });

        res.status(200).json({
            message: "Product updated successfully.",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.destroy();
        res.status(200).json({
            message: "Product deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};