const express        = require('express'),
      app            = express(),
      bodyParser     = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose       = require('mongoose'),
      port           = 4000,
      routes         = require('./routes.js')

//Connection to database
mongoose.connect('mongodb+srv://atanao:dontinon@cluster0.enweg.mongodb.net/MyAppDB?retryWrites=true&w=majority', 
{useNewUrlParser:true,useUnifiedTopology:true}, 
    function(err,database){
        if(err){
           throw err
        }
        console.log("Connection made to Database")
   }
)

//Middlewear
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }));
app.use(methodOverride("_method"));

//routes
app.use(routes)

//Call the port number which the server is running on
app.listen(port,()=>{
    console.log(`App running on port:${port}`)
})