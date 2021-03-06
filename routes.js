const express        = require('express'),
      router         = express.Router(),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      User           = require("./models/Users.js"),
      carSchema      = require("./models/carSchema.js")

      router.use(require("express-session")({
        secret:"Any normal Word",       //decode or encode session
        resave: false,          
        saveUninitialized:false    
    }))
    
    passport.serializeUser(User.serializeUser())       //session encoding
    passport.deserializeUser(User.deserializeUser())   //session decoding
    passport.use(new LocalStrategy(User.authenticate()))
    router.use(passport.initialize())
    router.use(passport.session())

//Sign up route
router.get('/', (req,res) =>{
    res.render('SignUp')
})

//Create new record for new user
router.post("/sign-up",(req,res)=>{
    
    User.register(new User({username: req.body.username,password:req.body.password,fullName:req.body.fullName}),
        req.body.password,function(err,user){
        if(err){
            console.log(err)
            res.render("SignUp")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/login")
        })    
    })
})

//Login route
router.get("/login",(req,res)=>{
    res.render("login")
})

//User Authentication
router.post("/login",passport.authenticate("local",{
    successRedirect:"/user-profile",
    failureRedirect:"/login"
}),function (req, res){

})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

router.get("/user-profile",isLoggedIn ,(req,res) =>{
    res.render("addCar")
})

//Add a new car record to the database
router.post("/add-car-details",(req,res)=>{
    var name = req.body.name;
    var plateNo = req.body.plateNo;
    var colour = req.body.colour;
    var model = req.body.model;
    var newCar = {name:name,plateNo:plateNo,colour:colour,model:model};
    carSchema.create(newCar,(err,data)=>{
        if(err){
            console.log(err);
        }else {
            console.log(data);
            res.redirect("/view-car-info");
        }
    })
})

//Retrieve car records from the database
router.get("/view-car-info",(req, res)=>{
    carSchema.find({},(err,cars)=>{
        if (err) {console.log(err);
        }else{
            res.render("viewCar",{cars: cars});
        }
    })
    
})

//Delete car records from the database
router.delete("/delete-car-record:id",(req,res)=>{
    carSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/view-car-info");
        }else {
            res.redirect("/view-car-info");
            }
    })
})

//Update car records in the database
//Get EditForm
router.get("/update-car-record:id/edit",(req,res)=>{
    carSchema.findById(req.params.id,function (err, car){
        if(err){
            console.log(err);
            res.redirect("/view-car-info");
        }else{
            res.render("updateCar",{car: car});
        }
    })
})

//Edit Put request
router.put("/update-car-record:id/edit",(req, res)=>{
    carSchema.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/view-car-info");
        }
    })
})

module.exports = router