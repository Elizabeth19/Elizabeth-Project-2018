var express = require("express");
var app = express();

// Middleware
var http = require('http');
var bodyParser = require("body-parser");
var fs = require('fs');

app.use(express.static("views")); // Allow access to content of views folder
app.use(express.static("scripts")); // Allow access to content of scripts folder
app.use(express.static("img")); // Allow access to content of images folder

app.set("view engine", "jade"); // This line sets the default view engine - which is the Jade Templating System

app.use(bodyParser.urlencoded({extended:true}));

var products = require("./model/products.json"); // allow the app to access the products.json file

// This function calls the Homepage view when the user navigates to this page.
app.get('/', function(req, res) {
  res.render("index");
  console.log("Homepage now rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
});

// This function calls the About Us view when the user navigates to this page.
app.get('/about' , function(req, res) {
 res.render("about");
  console.log("About Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// This function calls the Products view when the user navigates to this page.
app.get('/products' , function(req, res) {
 res.render("products",
           {products:products}
           );
  console.log("Products Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// This function calls the Gallery Page view when the user navigates to this page.
app.get('/gallery' , function(req, res) {
  res.render("gallery");
  console.log("Gallery Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// This function calls the Contact Page view when the user navigates to this page.
app.get('/contact' , function(req, res) {
  res.render("contact");
  console.log("Contact Page is rendered"); // log function is used to output data to the terminal to check that the app is doing as intended
  
})

// This function allows the Contact Form Post Request to return a message. I was not able to take this functionality further in this project
// To be able to capture the feedback and keep it as persistent data.
app.post('/', function(req, res) {
  res.end("Thank you for your Feedback! We have noted your input!");
  console.log("Feedback Post Successful"); // log function is used to output data to the terminal to check that the app is doing as intended
  
});

// The function to render the Show Individual Product / Camp Page

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

// Function to call the Add Product / Camp Page

app.get('/add', function(req, res){
  res.render("add");
  console.log("Add page is rendered");
  
})

//Function to create a New Product / Camp

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

// Code to render the Edit Products / Camps Page

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
      
      var w = req.body.newname;
      var x = req.body.newcategory;
      var y = req.body.newwebsite;
      var z = req.body.newimage;
      
      products.splice(index, 1 , {name: w, category: x, website: y, image: z} );
      
      json = JSON.stringify(products, null, 4);
      
      fs.writeFile('./model/products.json', json, 'utf8'); // Writing the data back to the file
	
      
  res.redirect("/products")
});


// Delete Products Function

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
  
  console.log("One to telete is " + keytoFind)
  
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
