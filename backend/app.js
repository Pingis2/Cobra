var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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
    socketTimeoutMS: 100000, // Timeout after 1 minute if no activity
    connectTimeoutMS: 100000, // Timeout after 1 minute for initial connection
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
connectToDatabase();

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

app.use((req, res, next) => {
    if (!req.app.locals.db) {
        console.error("Database not initialized");
        return res.status(500).send("Database not initialized");
    }
    next();
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use('/', indexRouter);

app.get("/api/leaderboard", async (req, res) => {
    console.log("Fetching users");
    res.json({ message: "Testing endpoint" });
    /*
    try {
        const db = client.db("Users"); // Ensure your database client is initialized properly
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
    */
})

app.get("api/test", async (req, res) => {
    res.json({ message: "Testing endpoint" });
})

app.post("/api/add-user", async (req, res) => {
    try {
        const db = client.db("Users");
        const user = req.body;
        const result = await db.collection("users").insertOne(user);
        console.log("Inserted user:", result);
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

        console.log("Response to client:", {
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });

        return res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        })
            ;
    } catch (error) {
        console.error("Error logging in", error);
    }
    
});

app.listen(5000, () => { console.log("Server is running on port 5000") })

module.exports = app;
