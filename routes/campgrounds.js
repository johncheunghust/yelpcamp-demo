var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");
//INDEX
router.get("/", (req, res)=>{
    //Get all campgournds from DB
    Campground.find({}, (err, allcamp)=>{
        if(err) console.log(err);
        else {
            res.render("campgrounds/index",{campgrounds: allcamp, curUser: req.user});
        }
    })
})

//CREATE
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //get data from form and add to campgrounds array
    //redirect back to campgrounds page
    // res.send("YOU HIT IT");
    var name = req.body.name
    var image = req.body.image
    var price = req.body.price
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newC = Campground.create({
        name: name,
        image: image,
        description: desc,
        author: author,
        price: price
    },(err, newC)=>{
        if(err) console.log(err)
    })
    res.redirect("/campgrounds")
})

// NEW
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new.ejs");
})

//SHOW
router.get("/:id", (req, res)=>{
    //find the campground with provided IP
    //render show template
    Campground.findById(req.params.id).populate("comments").exec((err,found)=>{
        if(err) console.log(err);
        else {
            console.log(found)
            res.render("campgrounds/show",{campground:found});
        }
    })
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    //is user logged in
        Campground.findById(req.params.id, (err, found)=>{
            res.render("campgrounds/edit", {campground:found});
        })
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    //find and update the target campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updated)=>{
        if(err) res.redirect("/campgrounds");
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
    //redirect to the show page 
})

//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err) {
            res.redirect("/campgrounds");
        }
        else res.redirect("/campgrounds");
    })
})





module.exports = router;