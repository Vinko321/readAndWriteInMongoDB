const mongoose = require('mongoose');

let igracSchema = mongoose.Schema({
    punoIme: {type: String, unique: true, required: true},
    pozicija: {type: String, required: true},
    uzrast: {type: String, required: true},
    visina:{type: Number}
});

module.exports = mongoose.model("Igrac", igracSchema,  "Igraci");