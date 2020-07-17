//all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");
middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("err", "Please Login First");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, found)=>{
            if(err) res.redirect("/campgrounds");
            // does user own the comment?
            else {
                //found.author.id--mongoose object
                //req.user._id--string
                if(found.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
            } 
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, found)=>{
            if(err) {
                res.redirect("/campgrounds");
                req.flash("err", "Campground not found!");
            }
            // does user own the campground?
            else {
                //found.author.id--mongoose object
                //req.user._id--string
                if(found.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
            } 
        })
    } else {
        req.flash("err", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;