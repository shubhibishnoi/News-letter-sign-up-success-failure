const express = require("express");
const bodyParser = require("body-parser"); //helps to look thru the body of the post request and
// fetch the data based on the name of the input
const https = require('https');
const app = express();
// The app.use() function is used to mount the specified middleware function(s)
//  at the path which is being specified.
//  It is mostly used to set up middleware for your application.
app.use(express.static("public")); //for our server to serve the local files like css ,
//images, we use this. providing the path of our ststic files in
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", function(req, res) { //The app.get() function routes the HTTP GET Requests to the path
  // which is being specified with the specified callback functions.
  // Basically is it intended for binding the middleware to your application
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res) { //this is done get the text that we have entered in the label
  // console.log(req.body.cityName);  //after writing app.use we come to post the input
  //we entered in city name,, req.body.(name of the input)
  //console.log("post recived");  //gets in git as post recived
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

const data = {                //inside our data object we have to provide all our key value pairs
  //with keys that Mailchimp will recgnixe
    members:[//our data is going to be called members and this member has to be an array of objects
      {        //so we're going to open another set of objects and we're
              // only going to have single object in our array bz we're going to
                //subscribe single person at a tym
    email_address: email,  //its value is going to be the email that we got from body of the post request
status:"subscribed",  //string type
merge_fields: {          //objects
  FNAME: firstName,
  LNAME: lastName
}
    }
    ]
};
  //now we have our data object compltetd but this is JS and now we hve to convert in JSON
const JsonData = JSON.stringify(data); //JsonData is wht we are going to send to Mailchimp
//now we'll make get request (used https.get: makes get request to get data from extrnl resource)
//but here we want to,post data to the external rsource
const url = "https://us1.admin.mailchimp.com/e7c7105b44";
                      //the url is going to come from the main Mailchimp endpoint
//replace the X  with the number tht u hve in ur api key after us
//completed url now create options:
const options = {     // calling options n they r going to be and now going to b JS object
  method:"POST",  //most imp option is method now we want the post req to b succes so we provide
  //authentication
  auth: "shubhi:c2dad8bebb078c4f21bf9f07d8d3139e-us1",//auth keyword used for authentication,it uses any name colon the api key

}
const request = https.request(url , options , function(response){  //call back function going to give us a rsponse from Mailchimp server
if (response.statusCode === 200){
  res.sendFile(__dirname + "/success.html");
} else{
  res.sendFile(__dirname + "/failure.html");
}


response.on("data" , function(data){//we're going to check what data they hve sent us
  console.log(JSON.parse(data));
})
})
request.write(JsonData) ;// passing JsonData to the mailchimp server
request.end();    // done with the request
});




  //https://mandrillapp.com/api/1.0/templates/update \
app.listen(process.env.PORT || 3000, function() { //(process.env.PORTdefined by heroku)
  //basicaly a dynamic port that heroku will define on the go
  // so at any port may b 3000 or 5000 it can decide to deploy
  //we want this objrct to listen on this port for heroku but also want to listen locally on port 3000
  //so by puttimg process.env.PORT we run both on heroku and locally
  console.log("server running on port 3000");
});


// c2dad8bebb078c4f21bf9f07d8d3139e-us1  API key
// e7c7105b44   list id
