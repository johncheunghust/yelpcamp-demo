var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground.js"),
    // seedDB          = require("./seeds.js"),
    Comment         = require("./models/comment.js"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
    
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp_v8");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"))

app.use(bodyParser.urlencoded({extended: true}))
app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("The Yelpcamp Server has Started!")
})

app.set("view engine", "ejs") ;

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Yelpcamp",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.curUser = req.user;
    res.locals.err = req.flash("err");
    res.locals.suc = req.flash("suc");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);