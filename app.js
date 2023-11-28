const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const _ = require("lodash")

let workList = [];
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')


// HwfTROYkX40Jg90j


  mongoose.connect('mongodb+srv://admin-sultan:HwfTROYkX40Jg90j@cluster0.db4gg.mongodb.net/todolist');
  const itemSchema = new mongoose.Schema({
    name:String
  })
  const Item = mongoose.model("Item", itemSchema)

  const Item1 = new Item({
    name: "Welcome to your todo list."
  })
  const Item2 = new Item({
    name: "Hit the + button to add an item."
  })
  const Item3 = new Item({
    name: "<-- Hit this to delete an item."
  })

  const defaultItems = [Item1, Item2, Item3]

 const listSchema = new mongoose.Schema({
    name: String, 
    items: [itemSchema]
 })

 const List = mongoose.model("List", listSchema)






app.get("/", function(req, res){
    Item.find({}).then(function(results){
        if (results.length === 0){
            Item.insertMany(defaultItems).then(function(){
                console.log("Database Successfully Updated")
              }).catch(function(err){
                console.log(err)
              })
              res.redirect("/")
        }
        else{
            res.render("list", {listTitle: "Today", newItems:results})
        }
        
    }).catch(function(err){
        console.log(err)
    })

    
})

app.get("/:ListName", function(req, res){
    const ListName = _.capitalize(req.params.ListName) 
    List.findOne({name: ListName}).then(function(result){
        if(!result){
            const customList = new List({
                name:ListName, 
                items:defaultItems
            })
            customList.save()
            res.redirect("/" + ListName)
        }else{
            res.render("list", {listTitle: result.name, newItems:result.items})
        }
    })
   
    // res.render("list", {listTitle: ListName, newItems : })
})

// app.post("/work", function(req, res){
//     const newItem = req.body.listItem
//     for (var i = 0; i<workList.length; i++){
//         if (newItem === workList[i]){
//             res.send("This Item Already Exist In The List.")
//             return 
//         }
//     }
//     workList.push(newItem)
//     res.redirect("/work")
// })

app.post("/", function(req, res){
    const newItem = req.body.listItem
    const ListName = req.body.list

   

    const added_Item = new Item({
        name: newItem
    })
    if(ListName === "Today"){
        added_Item.save().then(function(){
            res.redirect("/")
        })
    }else{
        List.findOne({name:ListName }).then(function(result){
            result.items.push(added_Item)
            result.save()
            res.redirect("/" + ListName)
        })
    }
   
    // if (req.body.list === "work List"){
    //     for (var i = 0; i<workList.length; i++){
    //         if (newItem === workList[i]){
    //             res.send("This Item Already Exist In The List.")
    //             return 
    //         }
    //     }
    //     workList.push(newItem)
    //     res.redirect("/work")
    // }
    // else{
    //     for (var i = 0; i<itemList.length; i++){
    //         if (newItem === itemList[i]){
    //             res.send("This Item Already Exist In The List.")
    //             return 
    //         }
    //     }
    //     itemList.push(newItem)
    //     res.redirect("/")
    // }
   
    
})

app.post("/delete", function(req, res){
    const checkedItem = req.body.checkbox
    const listName = req.body.listName

    if (listName === "Today"){
        Item.findByIdAndDelete(checkedItem).then(function(){
            res.redirect("/")
        })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id : checkedItem}}}).then(function(){
            res.redirect("/" + listName)
        })
    }

    
})

app.listen(3000, function () {
    console.log("server has successfully been started at port 3000.")
});

