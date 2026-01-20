const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { sequelize, connectDB } = require("./database/Database");

// Enable CORS BEFORE other middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:5001"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/user/",require('./routes/UserRoutes'))
app.use("/api/product/",require('./routes/ProductRoutes'))

app.get("/", (req,res) => {
    res.json({message: "Welcome to the Home Page"});
});

// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to the API!");
// });

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Visit: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();