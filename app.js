//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds =10;
mongoose.set('strictQuery', true);     

const app = express();
// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true}) //to establish mongodb connection

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});
const user = new mongoose.model("user",userSchema);


app.get("/",function(req,res){ 
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});


app.post("/register", function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new user({
            email : req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (err){
                console.log(err)
            }
            else{
                res.render("secrets");
            }
        });
    });
});

app.post("/login",function(req, res){
    const username = req.body.username;
//    const password = md5(req.body.password);
    const password = req.body.password;
    user.findOne({email: username},function(err, foundUser){
        if (err){
            console.log(err);
        }
            // if (foundUser.password === password){
            //     res.render("secrets");
            // }
            if (foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true){
                    res.render("secrets");
                }
            });
        }
    })
});

app.listen(3000, function(){
    console.log("server started at port 3000");
});