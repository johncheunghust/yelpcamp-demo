var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");
//COMMENTS ROUTES
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) console.log(err);
        else {
            res.render("comments/new", {campground: campground});
        }
    })
    
})

router.post("/", middleware.isLoggedIn , (req, res) =>{
    //lookup using ID
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) {
            console.log(err);
            req.flash("err", "Something wrong with the db")
            res.redirect("/campgrounds");
        }
        else {
            //create 
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) console.log(err);
                else {
                    //add username and id to comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("suc", "comment succeeds!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
            
        }
    })
    
    //connect new comment to campground 
    //redirect to showpage
})

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, found)=>{
        if(err) res.redirect("back");
        else res.render("comments/edit", {campground_id: req.params.id, comment: found});
    })
})
//comment update
router.put("/:comment_id/", (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated)=>{
        if(err) res.redirect("back");
        else res.redirect("/campgrounds/"+req.params.id);
        
    })
})

//COMMENT DESTROY ROUTE
router.delete("/:comment_id/", middleware.checkCommentOwnership, (req, res)=>{
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err) res.redirect("back");
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


module.exports = router;