const express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	session = require("express-session")
const User = require("./model/User");
let app = express();
const userRoute = require('./routes/userRoutes');
const roleRoute = require('./routes/roleRoutes');
const recordRoute = require('./routes/recordRoutes');
const homeRoute = require('./routes/homeRoute');

mongoose.connect("mongodb://localhost:27017/Login");


	
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: 'This is a sample login page',
	resave: false,
	saveUninitialized: true,
    cookie: {maxAge: 300000},
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', homeRoute);
app.use('/users', userRoute);
app.use('/roles', roleRoute);
app.use('/records', recordRoute);


const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});