const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express()
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


let iterms = [];
let Workiterms = [];

app.get("/",function(req,res){
    
    let day = date.getDate();
    res.render("lists",{listTitle:day, newListIterms: iterms});

})

app.get("/work",function(req,res){

    res.render("lists", {listTitle: "Work List", newListIterms: Workiterms})
})

app.get("/about",function(req,res){
    res.render("about")
})

app.post("/",function(req,res){
    let iterm = req.body.newiterm;

    if (req.body.list === "Work"){
        Workiterms.push(iterm);
        res.redirect("/work");
    }else{
        iterms.push(iterm);
        res.redirect("/");
    }  
})

app.listen(3000,function(){
    console.log("SERVER HAS STARTED AT PORT 3000")
});