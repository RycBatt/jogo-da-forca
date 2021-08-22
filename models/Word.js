const mongoose = require("mongoose");

const word = new mongoose.Schema({
    palavra: String
});

module.exports = word;