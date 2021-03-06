var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
router.get("/", (req, res)=>{
    res.render("landing");
});




//auth routes
//show register form
router.get("/register", (req, res)=>{
    res.render("register");
})
//handle sign up logic
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err) {
            console.log(err);
            req.flash("err", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("suc", "Welcome to Yelpcamp" + user.username);
            res.redirect("/campgrounds");
        });
    })
})

//show login form
router.get("/login", (req, res)=>{
    res.render("login");
})
//handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), (req, res)=>{
    
})

//logout route
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("suc", "Logged you out!");
    res.redirect("/campgrounds");
})


module.exports = router;