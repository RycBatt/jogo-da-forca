var word = require("../models/Word");
var mongoose = require("mongoose");
var WordFactory = require("../factories/WordFactory");

const Word = mongoose.model("Palavra",word);

class WordService {
    
    async Create(palavra){
        var newWord = new Word({
                palavra
        });
        try{
            await newWord.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async GetAll(){
        return await Word.find();
    }

}

module.exports  = new WordService();