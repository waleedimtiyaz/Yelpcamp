var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment =   require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find id
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
    //    lookup for the campground id
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
            //    create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add new username and id to a comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save to comment
                    comment.save();
                    //    connect new comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    //    redirect to campground show page
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
    Comment.findById(req.params.comment_id, function (err, foundComment){
       if(err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment){
       if(err){
           res.redirect("back");
        } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;