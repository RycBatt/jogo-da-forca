class WordFactory{

    Build(simpleAppointment){

        var word = {
            id: simpleAppointment._id,
            palavra: simpleWord.palavra, 
        }
        
        return word;
    }

}

module.exports = new WordFactory();