const express =require("express");
const bodyParser =require("body-parser");
const request =require("request");
const https =require("https");

const app =express();
// app.use(express.static(__dirname)); //to static files working
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

// post method to get mail, name from form in home page
app.post("/", function(req,res){
  const firstName = req.body.fName;
  const  lastName= req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  // to send posted data to mailchimp , as stated in mailchimp doc, we need members as an array of object [{}]
  const data = {
    members: [
      {
        email_address:email,
        status:"subscribed",
        merge_field :{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  // as stated in quick start curl part, we need send flattenend JSON
  const jsonData=JSON.stringify(data);  //need to send flat packed json to mailchimp

  // endpoint where us8 taken from apikey, since mailchimp have many server to login users
  const url ='https://us8.api.mailchimp.com/3.0/lists/e8c9cbf663';
  // according http method, option is parameter for request method
  // where we state method as post, but get is default and passing keys as auth parameter said in http docs
  const options = {
    method:"POST",
    auth:"divya5555:ab3d3845fc6b8f846b0528b65807f52f-us8"
  }
  //to post data to external system ie mailchimp here
  // to take endpoint, options(auth, method), callback function as parameter for https. request()
  const request = https.request(url,options, function(response){

    if (response.statusCode === 200){

      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      });
  })

//  to send json data to mailchimp, we need to create a variable for http request method and write down and end the data
  request.write(jsonData);
  request.end();
});
// redirect to home page if error
app.post("/failure", function(req,res){
  res.redirect("/");
})

// to deploy in heroku, we need dynamic port on their local system, || or port 5000 for running in this port locally
app.listen(process.env.PORT || 5000, function(){
  console.log("The server stated on port 5000.")
});
// https://mailchimp.com/developer/marketing/api/list-activity/
// https://mailchimp.com/developer/marketing/api/abuse-reports/
// https://us8.admin.mailchimp.com/lists/members?id=861397#p:1-s:25-sa:last_update_time-so:false
// ab3d3845fc6b8f846b0528b65807f52f-us8
// audience id
// e8c9cbf663
