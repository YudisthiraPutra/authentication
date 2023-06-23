//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const encrypt= require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
})
app.get("/login", function(req,res){
    res.render("login");
})
app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res)
{
    let emails = req.body.username;
    let pass = req.body.password;
    const newUser = new User({
        email: emails,
        password: pass
    });

    console.log(newUser.email);
    console.log(newUser.password);

    newUser.save()
        .then(function()
        {
            console.log("email and pass are saved");
            res.render("secrets");
            // console.log(err)
            
        })
        .catch(function(err)
        {
            // console.log("email and pass are saved");
            // res.render("secrets");
            console.log(err);
        })
}); 

app.post("/login", function(req,res)
{
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({email: username})
        .then(function(foundUser)
        {
            console.log(foundUser);
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
            else
            {
                console.log("wrong password");
            }
        })
        .catch(function(err)
        {
            console.log(err);
        })
})

app.listen('3000', function(){
    console.log("youre in");
});