var express = require("express");
var app = express();

app.use(express.static("views")); // Allow access to content of views folder
app.use(express.static("scripts")); // Allow access to content of scripts folder
app.use(express.static("img")); // Allow access to content of images folder

app.get('/', function(req, res) {
  console.log("Homepage now rendered");
  
});




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Yipee it's running");
  
})