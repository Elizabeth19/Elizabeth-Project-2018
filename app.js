var express = require("express");
var app = express();

// Middleware //
var http = require('http');
var bodyParser = require("body-parser");
var fs = require('fs');

app.use(express.static("views")); // Allow access to content of views folder
app.use(express.static("scripts")); // Allow access to content of scripts folder
app.use(express.static("img")); // Allow access to content of images folder

app.set("view engine", "jade"); // This line sets the default view engine - which is the Jade Templating System

app.use(bodyParser.urlencoded({extended:true}));

var products = require("./model/products.json"); // allow the app to access the products.json file

// ** Database Connection to mongodb on mLabs for the functionality on the Locations Page
// ** Mongoose Connection - mongodb://athlonekidscamps:nci2018@ds161751.mlab.com:61751/athlonekidscamps

var mongoose = require("mongoose")

mongoose.connect('mongodb://athlonekidscamps:nci2018@ds161751.mlab.com:61751/athlonekidscamps', {useNewUrlParser:true} )
  .then(function(){
    console.log("Connection to dbmongo Successful")
  })
  .catch(function(){
    console.log("ERROR connecting")
  })


/////////////// ************* ///////////// FUNCTIONALITY FOR THE APP PAGES *************** ///////////// ************* ////////////


// ** NEW FUNCTION ** HOMEPAGE ** This function calls the Homepage view when the user navigates to this page.

app.get('/', function(req, res) {
  res.render("index");
  console.log("Homepage now rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
});

// ** NEW FUNCTION ** ABOUT PAGE ** This function calls the About Us view when the user navigates to this page.

app.get('/about' , function(req, res) {
 res.render("about");
  console.log("About Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// ** NEW FUNCTION ** PRODUCTS / CAMPS PAGE ** This function calls the Products view when the user navigates to this page.

app.get('/products' , function(req, res) {
 res.render("products",
           {products:products}
           );
  console.log("Products Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// ** NEW FUNCTION ** LOCATIONS PAGE Functionality ** This Functionality is linked to dbmongo DATABASE ** //

// Setting up the Location specific Schema //

var LocationSchema = new mongoose.Schema({
  name:String
});

var Location = mongoose.model('locations', LocationSchema);


// This function calls the Locations view when the user navigates to this page and handles any errors.

app.get('/locations' , function(req, res) {
 
  console.log("Locations Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
    Location.find({}, function(err, location){
      if(err) console.log('errorpage');
      res.render('locations', {locations:location} )
    });
});

// This function allows for only one location to be queried on the client side

app.get('/locations/:name', function(req, res){
    Location.findOne({name:req.params.name}, function(err, location){
      if(err) console.log('errorpage');
      res.render("location", {location:location} )
    });
});


/*
 * GET Locations listing that are in dbmongo displaying on the Locations page.
 */

exports.list = function(req, res){

    var location = {name:"Athlone Institute of Technology"}
    
    res.render('locations', location)
};


// This function allows for new locations to be added from the Locations page client-side and saved on dbmongo database

app.post('/locations', function(req,res){
  var location = new Location({name:req.body.name})
  location.save()
  res.render("confirmation") // Catch page for New Location Added
})


// ** NEW FUNCTION ** GALLERY PAGE ** This function calls the Gallery Page view when the user navigates to this page.

app.get('/gallery' , function(req, res) {
  res.render("gallery");
  console.log("Gallery Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// ** NEW FUNCTION ** CONTACT PAGE ** This function calls the Contact Page view when the user navigates to this page.

app.get('/contact' , function(req, res) {
  res.render("contact");
  console.log("Contact Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// ** NEW FUNCTIONS ** CONTACT PAGE FORM SUBMIT ** HOMEPAGE SUBSCRIBE EMAIL SUBMIT ** CATCH PAGES FOR POST REQUESTS ** 

// This function allows the FORM Submission (Contact Page) and SUBSCRIBE button (Homepage) to direct to pages that have a 
// return message for the user: - confirmation.jade for FEEDBACK and subscribe.jade for SUBSCRIBE.
// Because it is nice to acknowledge the user for their input rather than not!
// There is an option on each catch page to return to the Contact Page or Homepage respectively, via a link pointing back.

app.post('/contact', function(req,res){ 
  res.render("form") // Catch page for Contact Form submission
})

app.post('/', function(req,res){
  res.render("subscribe") // Catch page for Subscribe submission
})


//  ** NEW FUNCTION ** PRODUCT / CAMPS PAGE ** This function is to render the Show Individual Product / Camp Page

app.get('/show/:name', function(req, res) {
  function findProd(which) {
  return which.name === req.params.name;  
  }
  
  console.log(products.filter(findProd)); // Log in the console the product I am looking for
  indi = products.filter(findProd); // Javascript function to filter the products based on the params from findProd function
  
  res.render("show",
            {indi:indi}
            );
  console.log("Individual page is rendered");
  
})

// ** NEW FUNCTION ** Function to call the Add Product / Camp Page

app.get('/add', function(req, res){
  res.render("add");
  console.log("Add page is rendered");
  
})

// ** NEW FUNCTION ** Function to create a New Product / Camp ** This Function is linked with Data in the JSON FILE **

app.post('/add', function(req, res) {
  var count = Object.keys(products).length; // This tells us how many products we have in our JSON file
  console.log(count);
  
  // This will look for the current largest id
  
  function getMax(products , id) {
    var max
    for (var i=0; i<products.length; i++) {
      if(!max || parseInt(products[i][id]) > parseInt(max[id]))
        max = products[i];
      
    }
    return max;
  }
  
  var maxPpg = getMax(products, "id");
	newId = maxPpg.id + 1;
	console.log(newId);
  
  // Create a new Product / Camp based on information in the Add Camps page Form
  
  var product = {
    name: req.body.name,
    id: newId, // This is the variable created above
    category: req.body.category,
    price: req.body.price,
    location: req.body.location,
    website: req.body.website,
    image: req.body.image
  };
  
  var json  = JSON.stringify(products); // Convert from an object to a string, with stringify
  
  fs.readFile('./model/products.json', 'utf8', function readFileCallback(err, data){
    if (err){
      console.log("Something Went Wrong");
    }
    else{
      products.push(product); // add the information from the above variable - everything in the form including the id
		json = JSON.stringify(products, null , 4); // converted back to JSON
		fs.writeFile('./model/products.json', json, 'utf8'); // Write the file back
		
	}});
	res.redirect("/products")
});

// ** NEW FUNCTION ** This function is to render the Edit Products / Camps Page

app.get('/edit/:name', function(req, res){

  console.log("Edit Page has been shown");
  
  function chooseProd(indOne){
    return indOne.name === req.params.name;
  }
  
  var indOne = products.filter(chooseProd);
  
 res.render("edit",
            {indOne:indOne}
           );
	
	console.log(indOne);
	});  
  
app.post('/edit/:name', function(req, res){
  var json = JSON.stringify(products);
  
      var keyToFind = req.params.name; // call name from the url
      
      var data = products;
      var index = data.map(function(product) {return product.name;}).indexOf(keyToFind)
      
      var u = req.body.newname;
      var v = req.body.newcategory;
      var w = req.body.newprice;
      var x = req.body.newlocation;
      var y = req.body.newwebsite;
      var z = req.body.newimage;
      
      products.splice(index, 1 , {name: u, category: v, price: w, location: x, website: y, image: z} );
      
      json = JSON.stringify(products, null, 4);
      
      fs.writeFile('./model/products.json', json, 'utf8'); // Writing the data back to the file
	
      
  res.redirect("/products")
});


// ** NEW FUNCTION ** DELETE PRODUCTS / CAMPS ** This function is for the Delete Products / Camps **

app.get('/delete/:name', function(req, res) {
  
  var json = JSON.stringify(products); // this is to Convert it from an object to string with stringify for use below
  
// Allow app to access the file that we want to delete  
 fs.readFile('./model/products.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      
var keytoFind = req.params.name; // This is to go through the products and find position based on the item name

      var str2 = products; // this changes the json to a variable str2

var data = str2; // this declares data = str2
var index2 = data.map(function(d) { return d['name']; }).indexOf(keytoFind) // finds the position by nae taken from http://jsfiddle.net/hxfdZ/

console.log("The position is " + index2 + "    " + keytoFind)
     
products.splice(index2 ,1); // This deletes one product only, from the position where the name occurs
       
   json = JSON.stringify(products, null, 4); //convert it back to json
    fs.writeFile('./model/products.json', json, 'utf8'); // write it back 
  console.log("Product Deleted");
    
}});

res.redirect("/products");
});

// End Delete Products Function


// Delete products Function 
app.get('/delete/:name', function(req, res){
  // allow app to access file we want to modify
  
  fs.readFile('./model/products.json')
  
  var keytoFind = req.param.name; // go through products and find position based on the item name
  
  var index2 = products.map(function(d) {return d['name']}).indexOf(keytoFind) // finds position and declare position as variable index
  
  // log the position and the name of the product in the console
  
  console.log("One to delete is " + keytoFind)
  
  products.splice(index2, 1); // This delets one product only from the location where the name occurs
  
  json = JSON.stringify(products, null, 4)
  fs.writeFile('./model/products.json', json, 'utf8'); // write the data back to our persistant data.
  
  console.log("It worked product deleted");
  
  res.redirect("/products")
})



// Function gets the application up and running on the Development Server
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  console.log("Yipee it's running");
  
});

// ********************* REFERENCES ********************** //

// ** APP FUNCTIONALITY - NODE JS, JSON, JADE ** 
// McCabe.L. (2018). "Web Application Development" (Class Lecture, NCI Live app. [ONLINE] 
// Available at: https://github.com/LiamMcC/ncilive/blob/Complete/app.js
// [Accessed 09 July 2018], National College of Ireland, Dublin, March 2018.)

// ** WEB APP TEMPLATE - FREE HTML BOOTSTRAP TEMPLATE from UI COOKIES ** 
// UI Cookies (2018). GREEN. [ONLINE] 
// Available at: https://uicookies.com/downloads/green-free-html5-website-template-using-bootstrap-framework/ [Accessed 19 May 2018]

// ** DB MONGO MLAB DATABASE CONNECTION **
// mLab DOCS + SUPPORT. 2018. [ONLINE] Available at: https://docs.mlab.com/ [Accessed 31 July 2018]
