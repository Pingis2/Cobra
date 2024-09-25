var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const MONGODB_URI = "mongodb+srv://vercel-admin-user-66f3947340812d083bafe300:goKMDYTa8TSdcyhV@cluster0.vcd7gi2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB Atlas");

        const db = client.db();
        app.locals.db = db; // Make the db accessible globally in your app

        // You can use `db` here to access collections, etc.
    })
    .catch(error => console.error(error));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
