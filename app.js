var express = require("express");
var app = express();

app.use(express.static("views")); // Allow access to content of views folder
app.use(express.static("scripts")); // Allow access to content of scripts folder
app.use(express.static("img")); // Allow access to content of images folder

app.set("view engine", "jade"); // This line sets the default view engine

app.get('/', function(req, res) {
  res.render("index");
  console.log("Homepage now rendered");
  
});

app.get('/about' , function(req, res) {
 res.render("about.jade");
  console.log("About Page is rendered");
  
})

app.get('/gallery' , function(req, res) {
  res.render("gallery.jade");
  console.log("Gallery Page is rendered");
  
})


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Yipee it's running");
  
})