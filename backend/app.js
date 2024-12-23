var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { MongoClient, ServerApiVersion } = require('mongodb');

var app = express();

const MONGODB_URI = "mongodb+srv://antonschyberg08:Dajmkryss1234@cluster0.vcd7gi2.mongodb.net/mymongodb?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db();
        app.locals.db = db;
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
connectToDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    if (!req.app.locals.db) {
        console.error("Database not initialized");
        return res.status(500).send("Database not initialized");
    }
    next();
});

app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get("/users", async (req, res) => {
    const db = client.db("Users");
    if (!db) {
        console.error("Database not initialized");
        return res.status(500).send("Database not initialized");
    }
    try {
        const users = await db.collection("users").find().toArray();
        if (users.length === 0) {
            console.log("No users found in the database");
        } else {
            console.log("Fetched users:", users);
        }
        res.json({ users });
    } catch (err) {
        console.error("Error getting users", err);
        res.status(500).send("Error getting users");
    }
})

app.post("/addUser", async (req, res) => {
    const db = client.db("Users");
    if (!db) {
        console.error("Database not initialized");
        return res.status(500).send("Database not initialized");
    }
    try {
        const user = {
            firstName: "Panton",
            lastName: "Schyberg",
            email: "anton@email.com",
            password: "1234",
        };
        const result = await db.collection("doctors").insertOne(user);
        console.log("Inserted user:", result);
        res.json({
            _id: result.insertedId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (err) {
        console.error("Error inserting user", err);
        res.status(500).send("Error inserting user");
    }
})

app.get("/login", async (req, res) => {
    try {
        const db = client.db("Users");
        if (!db) {
            console.error("Database not initialized");
            return res.status(500).send("Database not initialized");
        }

        const { email, password } = req.query;
        
        if (!email || !password) {
            return res.status(400).send("Missing email or password");
        }

        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.password !== password) {
            return res.status(401).send("Invalid password");
        }

        return res.status(200).send("Login successful");
    } catch (error) {
        console.error("Error logging in", error);
    }
    
});

app.listen(5001, () => { console.log("Server is running on port 5000") })

module.exports = app;
