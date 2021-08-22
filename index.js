const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const wordService = require("./services/WordService");
const WordService = require("./services/WordService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/JogoDaForca",{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);

app.get("/", (req, res) => {
    res.send("oi");
});

app.get("/cadastro", async (req, res) => {
    
    var wordS = await WordService.GetAll(true);
    res.render("create",{wordS});
});

app.post("/create", async (req, res) => {

    var status = await wordService.Create(
        req.body.palavra
    )

    if(status){
        res.redirect("/cadastro");
    }else{
        res.send("Ocorreu uma falha!");
    }
});

app.post("/delete", async (req, res) => {

    var status = await wordService.Delete(
        req.body.palavra
    )

    if(status){
        res.redirect("/cadastro");
    }else{
        res.send("Ocorreu uma falha!");
    }
});

app.listen(4000, () => {});