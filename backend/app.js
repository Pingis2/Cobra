var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

var indexRouter = require('./routes/index');
const { MongoClient, ServerApiVersion } = require('mongodb');

var app = express();

const MONGODB_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  // Ensure that this is enabled for better connection handling
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    maxPoolSize: 20, // Limit the number of connections
    minPoolSize: 5, // Minimum number of connections
    socketTimeoutMS: 300000, // Timeout after 5 minutes if no activity
    connectTimeoutMS: 300000, // Timeout after 5 minutes for initial connection
    heartbeatFrequencyMS: 10000, // Send a heartbeat every 10 seconds
    retryWrites: true, // Enable retryable writes for better reliability
});

const initializedDatabase = async (db) => {
    try {
        const collections = await db.listCollections({ name: "users" }).toArray();
        if (collections.length > 0) {
            console.log("Collections found:", collections);
            return;
        }

        const usersCollection = db.collection("users");
        const existingUsers = await usersCollection.find().toArray();
        if (existingUsers.length > 0) {
            console.log("Users found:", existingUsers);
            return;
        }
    }
    catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}


const connectToDatabase = async () => {
    try {
        await client.connect();
        const db = client.db();
        app.locals.db = db;
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        await initializedDatabase(db);
        keepDatabaseAlive();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);  // Exit the process if the connection fails
    }
};

const keepDatabaseAlive = async () => {
    setInterval(async () => {
        try {
            await client.db().command({ ping: 1 });
            console.log("Pinged the database");
        } catch (error) {
            console.error("Error pinging the database:", error);
        }
    }, 300000);
}

process.on("SIGINT", async () => {
    console.log("Closing MongoDB connection");
    await client.close();
    process.exit(0);
});

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const hashedUser = { ...user, password: hashedPassword };

        user.password = hashedPassword;

        const result = await db.collection("users").insertOne(hashedUser);

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
                country: user.country,
                highscore: user.highscore,
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

        if (!user) {
            console.log("User not found:", email);
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", email);
            return res.status(401).send("Invalid password");
        }
        

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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ success: false, message: "Token is required" });
    }

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

        res.json({ users });
    } catch (err) {
        console.error("Error getting users", err);
        res.status(500).send("Error getting users");
    }
});

app.put("/api/update-highscore", async (req, res) => {
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
        db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            { $set: { highscore: req.body.highscore } }
        )
            .then(result => {
                if (result.matchedCount === 0) {
                    return res.status(404).send("User not found");
                }
                res.json({ success: true });
            })
            .catch(err => {
                res.status(500).send("Error updating highscore");
            });
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

(async () => {
    await connectToDatabase();
    app.listen(5000, () => {
        console.log("Server is running on port 5000 and database is connected.")
    })
})();

module.exports = app;
