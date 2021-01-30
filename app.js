var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")

// Requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


// seedDB();
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://waleed:0KE5fEVnkHCOvIjz@cluster0.a02lv.mongodb.net/yelpcamp?retryWrites=true&w=majority', {useNewUrlParser: true});
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
// mongodb+srv://waleed:0KE5fEVnkHCOvIjz@cluster0.a02lv.mongodb.net/yelpcamp?retryWrites=true&w=majority

// 0KE5fEVnkHCOvIjz
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello there",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Using routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



//Starting the server
app.listen(process.env.PORT || 3000,function(){
  console.log("Yelpcamp server has started!");
});
