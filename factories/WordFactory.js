class WordFactory{

    Build(simpleWord){

        var word = {
            id: simpleWord._id,
            palavra: simpleWord.palavra, 
        }
        
        return word;
    }

}

module.exports = new WordFactory();