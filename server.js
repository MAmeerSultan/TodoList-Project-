const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")

let itemList = ["Buy Food.", "Cook Food.", "Eat Food."];
let workList = [];
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')

let options = {
    weekday: "long",
    month: "long",
    day: "numeric"
}
let Day = new Date()
let currentDay = Day.toLocaleDateString("en-US", options)

app.get("/", function(req, res){
    

    res.render("list", {listTitle: currentDay, newItems:itemList})
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "work List", newItems: workList})
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
    let newItem = req.body.listItem
    if (req.body.list === "work List"){
        for (var i = 0; i<workList.length; i++){
            if (newItem === workList[i]){
                res.send("This Item Already Exist In The List.")
                return 
            }
        }
        workList.push(newItem)
        res.redirect("/work")
    }
    else{
        for (var i = 0; i<itemList.length; i++){
            if (newItem === itemList[i]){
                res.send("This Item Already Exist In The List.")
                return 
            }
        }
        itemList.push(newItem)
        res.redirect("/")
    }
   
    
})

app.listen(3000, function () {
    console.log("server has successfully been started at port 3000.")
});

