//jshint esversion:6

// Set express as Node.js web application
// server framework.
// To install express before using it as
// an application server by using
// "npm install express" command.

require("dotenv").config()
const express = require("express"),
    bodyParser = require("body-parser"),
    _ = require("lodash"),
    mongoose = require("mongoose"),
    encrypt = require("mongoose-encryption")


const app = express();


const options = {
    // keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
// create ting database here
mongoose.connect("mongodb://127.0.0.1:27017/userDB", options).then(() => console.log('DB connected'));


// express application creation high order function
app.set('view engine', 'ejs')


// Useing accepting the post object
app.use(bodyParser.urlencoded({ extended: true }));
// set path to the Static files
app.use(express.static(__dirname + '/public'))



const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })


const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.post("/register", function (req, res) {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    })
    newUser.save(function () {

        res.render("secrets")

    });
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, founduser) {
        if (err) {
            console.log('problem in find section' + err);
        }
        else {
            if (founduser.password === password) {
                res.render("secrets")
            }
        }
    })
})










app.listen('3000', function () {
    console.log('Server listening port is: 3000');
})


/* 1. What is Middleware ?
It is those methods / functions / operations that are called BETWEEN processing the Request and sending the Response in your application method.
2.When talking about express.json() and express.urlencoded() think specifically about POST requests (i.e. the .post request object) and PUT Requests (i.e. the .put request object).
3.You DO NOT NEED express.json() and express.urlencoded() for GET Requests or DELETE Requests.
4.You NEED express.json() and express.urlencoded() for POST and PUT requests, because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or PUT) Request.
5.Express provides you with middleware to deal with the (incoming) data (object) in the body of the request.
6.express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json()).
7.express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded()).
8.ALTERNATIVELY, I recommend using body-parser (it is an NPM package) to do the same thing. It is developed by the same peeps who built express and is designed to work with express. body-parser used to be part of express. Think of body-parser specifically for POST Requests (i.e. the .post request object) and/or PUT Requests (i.e. the .put request object).

// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(bodyParser.urlencoded({ extended: false }));
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(bodyParser.urlencoded({ extended: true }));


1.x-www-form-urlencoded ?
In HTTP there are two ways to POST data: application/x-www-form-urlencoded and multipart/form-data. I understand that most browsers are only able to upload files if multipart/form-data is used. Is there any additional guidance when to use one of the encoding types in an API context (no browser involved)? This might
e.g. be based on:data size
existence of non-ASCII characters
existence on (unencoded) binary data
the need to transfer additional data (like filename)

2.Summary; if you have binary (non-alphanumeric) data (or a significantly sized payload) to transmit, use multipart/form-data. Otherwise, use application/x-www-form-urlencoded

3.The MIME types you mention are the two Content-Type headers for HTTP POST requests that user-agents (browsers) must support. The purpose of both of those types of requests is to send a list of name/value pairs to the server. Depending on the type and amount of data being transmitted, one of the methods will be more efficient than the other. To understand why, you have to look at what each is doing under the covers.

4.For application/x-www-form-urlencoded, the body of the HTTP message sent to the server is essentially one giant query string -- name/value pairs are separated by the ampersand (&), and names are separated from values by the equals symbol (=). An example of this would be:MyVariableOne=ValueOne&MyVariableTwo=ValueTwo;
*/


