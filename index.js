var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    User            = require('./models/user'),
    flash           = require('connect-flash'),
    methodOverride  = require('method-override');
    
var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    authRoutes          = require('./routes/auth');

//Configuration
//mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://admin:3wC^a9LzPZo39L495e@ds147537.mlab.com:47537/yelp_camp");
mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport configuration
app.use(require('express-session')({
    secret: "Correct horse battery staple",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware that is called for EVERY route (DRY)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Requiring routes
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
//Note: will need to set mergeparams to capture ID
app.use("/campgrounds/:id/comments", commentRoutes);

//Index route
app.get("/", function(req, res){
   res.render("landing");
});

//Start application using c9 defaults
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Keep calm and deploy YelpCamp on");
});