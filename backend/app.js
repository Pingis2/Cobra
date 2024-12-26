var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ObjectId } = require("mongodb");

var indexRouter = require('./routes/index');
const { MongoClient, ServerApiVersion } = require('mongodb');

var app = express();

const MONGODB_URI = "mongodb+srv://antonschyberg08:Dajmkryss1234@cluster0.vcd7gi2.mongodb.net/mymongodb?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  // Ensure that this is enabled for better connection handling
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Enable automatic reconnection and retry logic
    maxPoolSize: 10, // Limit the number of connections
    socketTimeoutMS: 600000, // Timeout after 10 minutes if no activity
    connectTimeoutMS: 600000, // Timeout after 10 minutes for initial connection
    retryWrites: true, // Enable retryable writes for better reliability
});


const connectToDatabase = async () => {
    try {
        await client.connect();
        const db = client.db();
        app.locals.db = db;
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);  // Exit the process if the connection fails
    }
};


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
        origin: ["http://localhost:5173", "https://express-test-pearl.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.json());

app.use((req, res, next) => {
    if (!req.app.locals.db) {
        console.error("Database not initialized");
        return res.status(500).send("Database not initialized");
    }
    next();
});


app.use('/', indexRouter);

app.post("/api/add-user", async (req, res) => {
    try {
        const db = client.db("Users");
        const user = req.body;
        const result = await db.collection("users").insertOne(user);
        console.log("Inserted user:", result);

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        const token = jwt.sign(
            { _id: result.insertedId, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            user: {
                _id: result.insertedId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                password: user.password,
                country: user.country,
            },
            token,
        });
    } catch (err) {
        console.error("Error inserting user", err);
        res.status(500).json({ success: false, message: "Error inserting user" });
    }
})

app.post("/api/login", async (req, res) => {
    console.log("Logging in user", req.body);
    try {
        const db = client.db("Users");
        if (!db) {
            console.error("Database not initialized");
            return res.status(500).send("Database not initialized");
        }

        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }

        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });

        console.log("Received login attempt:", { email, password });

        if (!user) {
            console.log("User not found:", email);
            return res.status(404).send("User not found");
        }

        if (user.password !== password) {
            console.log("Invalid password for user:", email);
            return res.status(401).send("Invalid password");
        }

        console.log("Login successful for user:", email);

        console.log("JWT_SECRET", process.env.JWT_SECRET);
        

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        console.log("Response to client:", {
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            },
            token
        });

        return res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            },
            token,
        })
            ;
    } catch (error) {
        console.error("Error logging in", error);
    }
    
});

app.post("/api/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ success: false, message: "Token is required" });
    }

    // Simulate token invalidation or removal logic here (if needed)
    console.log("Token received for logout:", token);

    // Respond with success
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.get("/api/get-user", (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).send("Token is required");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid or expired token");
        }

        const userId = decoded._id;
        const db = client.db("Users");
        db.collection("users").findOne({ _id: new ObjectId(userId) })
            .then(user => {
                if (!user) {
                    return res.status(404).send("User not found");
                }
                res.json({ user });
            })
            .catch(err => {
                res.status(500).send("Error fetching user data");
            });
    });
});

app.get("/api/leaderboard", async (req, res) => {
    try {
        const db = client.db("Users");
        if (!db) {
            console.error("Database not initialized");
            return res.status(500).send("Database not initialized");
        }

        const users = await db.collection("users").find().toArray();

        if (!users || users.length === 0) {
            console.log("No users found in the database");
            return res.status(404).json({ message: "No users found" });
        }

        console.log("Fetched users:", users);
        res.json({ users });
    } catch (err) {
        console.error("Error getting users", err);
        res.status(500).send("Error getting users");
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

(async () => {
    connectToDatabase();
    app.listen(5000, () => { console.log("Server is running on port 5000 and database is connected.") })
})();

module.exports = app;
