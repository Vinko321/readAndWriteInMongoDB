const mongoose = require('mongoose');

// Define schema
// https://mongoosejs.com/docs/models.html#compiling
const oIgracuSchema = mongoose.Schema({
    visina: {type: Number},
    exKlubovi : {type: [String]},
    uspjesi: {type: [String]},
    opis: {type: String},
});

const adresaSchema = mongoose.Schema({
    mjesto : {type: String, required: true},
    ulica: {type: String, required: true},
    br: {type: String, required: true},
});

const kontaktInfoSchema = mongoose.Schema({
    telefon: {type: Number, required: true},
    email: {type: String},
    adresa: {type: adresaSchema},
});

const igracSchema = mongoose.Schema({
    id: {type: String, unique: true, required: true},
    slika: {type:String},
    punoIme: {type: String, unique: true, required: true},
    pozicija: {type: String, required: true},
    uzrast: {type: String, required: true},
    kontaktInfo: {type:kontaktInfoSchema},
    oIgracu: {type:oIgracuSchema},
});

module.exports = mongoose.model("Igrac", igracSchema,  "Igraci");