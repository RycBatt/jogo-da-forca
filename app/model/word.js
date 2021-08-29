var mongoose = require("mongoose");
var wordSchema = require("../schema/word");

const Word = mongoose.model("Palavra", wordSchema);

class WordModel {
  async Create(palavra){
    var newWord = new Word({
      palavra
    });
    try {
      await newWord.save();
      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  async Delete(palavra){  
    console.log(palavra[1]);
      try{
        await Word.findByIdAndDelete(palavra[1]);
        return true;
      } catch(err){
        console.log(err);
        return false;
      }
  }

  async GetAll(){
    return await Word.find();
  }
}
module.exports  = new WordModel();