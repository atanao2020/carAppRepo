const express        = require('express'),
      app            = express(),
      bodyParser     =  require("body-parser"),
      methodOverride = require("method-override"),
      mongoose       = require('mongoose'),
      passport       =  require("passport"),
      LocalStrategy  =  require("passport-local"),
      port           = 4000,
      User           =  require("./models/Users"),
      carSchema      =  require("./models/carSchema")

//===========================================================Connect to database
mongoose.connect('mongodb+srv://atanao:dontinon@cluster0.enweg.mongodb.net/MyAppDB?retryWrites=true&w=majority', 
{useNewUrlParser:true,useUnifiedTopology:true}, 
    function(err,database){
        if(err){
           throw err
        }
        console.log("Connection made to Database")
   }
)

//============Middlewear
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}))

passport.serializeUser(User.serializeUser())       //session encoding
passport.deserializeUser(User.deserializeUser())   //session decoding
passport.use(new LocalStrategy(User.authenticate()))
app.use(passport.initialize())
app.use(passport.session())

//===========================================================Sign up route
app.get('/', (req,res) =>{
    res.render('SignUp')
})

app.post("/sign-up",(req,res)=>{
    
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

//==========================================================Login route
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",passport.authenticate("local",{
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

app.get("/user-profile",isLoggedIn ,(req,res) =>{
    res.render("addCar")
})

//========================================================Adding a new car
app.post("/add-car-details",(req,res)=>{
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

//=====================================================Retrieving car details from the database
app.get("/view-car-info",(req, res)=>{
    carSchema.find({},(err,cars)=>{
        if (err) {console.log(err);
        }else{
            res.render("viewCar",{cars: cars});
        }
    })
    
})

//====================================================Deleting car records from the database
app.delete("/delete-car-record:id",(req,res)=>{
    carSchema.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/view-car-info");
        }else {
            res.redirect("/view-car-info");
            }
    })
})

//====================================================Updating car records in the database
//Get EditForm
app.get("/update-car-record:id/edit",(req,res)=>{
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
app.put("/update-car-record:id/edit",(req, res)=>{
    carSchema.findByIdAndUpdate(req.params.id,req.body.car,function(err,updatedata){
        if(err){
            console.log(err);
        }else{
            console.log(updatedata)
            res.redirect("/view-car-info");
        }
    })
})


//=================================================Calling the port number the server is running on
app.listen(port,()=>{
    console.log(`App running on port:${port}`)
})