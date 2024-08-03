const express = require("express");
const bodyParser = require("body-parser");
const  mongoose = require("mongoose");
const _ = require("lodash");

const app = express()
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true});

const itermsSchema = new mongoose.Schema({
    name: String
});

const iterm = mongoose.model("iterm",itermsSchema);

const iterm1 = new iterm({
    name: "Welcome to your to do list!"
});

const iterm2 = new iterm({
    name: "Hit the + button to add a new iterm"
});

const iterm3 = new iterm({
    name: "<-- Hit this to delete an iterm"
});

const listSchema = new mongoose.Schema({
    name: String,
    iterms: [itermsSchema]
});

const List = new mongoose.model("List",listSchema);

const defaultIterms = [iterm1,iterm2,iterm3]

app.get("/",function(req,res){

    iterm.find({},function(err,foundIterms){
        if(err){
            console.log(err);
        }else{
            if(foundIterms.length===0){
                iterm.insertMany(defaultIterms,function(err){
                    if (err){
                        console.log(err);
                    }else{
                        console.log("Succesfully saved the 3 iterms");
                    }
                });
                
                res.redirect("/");
            }
            else{
                res.render("lists",{listTitle:"Today", newListIterms: foundIterms});
            }
        }
    });  
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //creates new list
                const list = new List({
                    name: customListName,
                    iterms: defaultIterms
                });
            
                list.save();

                res.redirect("/" + customListName);
            }else{
                //shows existing lists
                res.render("lists",{listTitle: foundList.name, newListIterms: foundList.iterms});
            }
        }
    })

    
});


app.get("/about",function(req,res){
    res.render("about")
});

app.post("/",function(req,res){
    const itermName = req.body.newiterm;
    const listName = req.body.list;

    const iterm4 = new iterm({
        name: itermName
    });

    
    if(listName==="Today"){
        iterm4.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName},function(err,foundList){
            if(!err){
                foundList.iterms.push(iterm4);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItermId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        iterm.findByIdAndRemove(checkedItermId,function(err){
            if(err){
                console.log(err)
            }else{
                console.log("successfully deleted!")
            }
        });
    
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name: listName},{$pull: {iterms: {_id: checkedItermId}}},function(err,foundList){
        
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }

});

app.listen(3000,function(){
    console.log("SERVER HAS STARTED AT PORT 3000")
});