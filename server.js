const express       = require('express'),
      app           = express(),
      bodyParser    =  require("body-parser"),
      mongoose      = require('mongoose'),
      passport      =  require("passport"),
      LocalStrategy =  require("passport-local"),
      port          = 4000,
      User          =  require("./models/Users"),
      carSchema    =  require("./models/carSchema")

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

//============================================================Middle wear
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended:true, useUnifiedTopology:true }))

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

app.post('/car-details', function(req, res) {
    console.log("Car Details POST route hit")
    console.log(req.body)
    var carName = req.body.name
    var carPlateNo = req.body.plateNo
    var carColour = req.body.colour
    var carModel = req.body.model
    
    carSchema.create({
        name: carName,
        plateNo:carPlateNo,
        colour: carColour,
        model: carModel
    })
    .then(function(car){
        console.log('Car Details Saved')
        console.log(car)
        res.send(`<body style="background-color:steelblue">
                       <center><h1> Car Details Submitted Successfully </h1><br><br>
                       <div>
                           <button><a href="/"> Log Out </a></button>
                       </div>
                       <div>
                           <button><a href="/view-car-info"> View Car Details </a></button>
                       </div><center>
                  </body>`)
    })
    .catch(function(err){
        console.log(err)
    })
})

//=====================================================Retrieving car details from the database
app.get('/view-car-info', (req, res) =>{
    carSchema.find({}, function(err, profile){
        res.render("viewCar", { profile : profile});
        console.log(profile)
    })
})

//====================================================Deleting car records from the database
app.get('/delete-car-record:id', (req, res) =>{
    const id = req.params.id
    carSchema.findOneAndDelete(id, function(err, user) {
        if (err){
            throw err
        } 
        console.log(id)
        res.redirect('/view-car-info')
    })
})

//====================================================Updating car records in the database
app.get('/update-car-record', (req, res) =>{
    carSchema.findOne({}, function(err, profile){
        res.render("updateCar", { profile : profile});
    })
})

app.post('/update-car-record:id', (req, res) =>{
        updateRecord(req, res)
})
function updateRecord(req, res) {
    carSchema.findOneAndUpdate({ "id": req.body.id },{
        $set: {
            "name": req.body.name,
            "plateNo": req.body.plateNo,
            "colour": req.body.colour,
            "model": req.body.model
        }
     }, { new: true }, (err, car) => {
        if (!err) {  
            console.log(car);
            console.log(req.body);
            res.redirect('/view-car-info'); 
        }
        else {
            console.log(err);
        }
     });
    }


//=================================================Calling the port number the server is running on
app.listen(port,()=>{
    console.log(`Server running on port:${port}`)
})