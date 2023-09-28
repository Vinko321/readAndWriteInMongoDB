const express = require('express');
const Igrac = require("../model/Igrac");
const router = express.Router();
var hidden = "hidden"


// Showing igrac.ejs kad ništa ispred igrac ne piše
router.get("/", function (req, res) {
    let cssBtn = "btn-submit"

    res.render("usersPages/igrac",{ cssBtn: cssBtn, poruka: poruka});
});

// Handling igrac

router.post('/', (request, response) => {
    //ovoj stranici importiramo kod iz .env
    require('dotenv').config();
    /**
     * instalirali smo mongoose da bi se mogli spojiti na bazu
     * i tu importiramo mongoose i dodjeljujemo varijabli mongoose
     */
    const mongoose = require("mongoose");
    /**
     * konekt na bazu pomoću mongoose
     */
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    /**
     * ispisivanje na terminalu Connected ako smo se uspješno spojili ili Conn error...
     */
    mongoose.connection.on('connected', () => console.log('Connected'));
    mongoose.connection.on('error', () => console.log('Connection error: ${err.message}'));

    /**
     * po postu kreiramo novo Usera
     */
    const igrac = new Igrac({
        punoIme : request.body.punoIme,
        pozicija : request.body.pozicija,
        uzrast : request.body.uzrast,
        visina : request.body.visina
    });


    igrac.save().then(data => console.log('Successfully created a new Igrac')).catch(error => console.log('Neuspjelo spremanje kolekcije Igrac'))
let poruka = "Uspješno ste spremili novog igrača"
    let cssBtn = "btn-hidden"
    response.render("usersPages/igrac",{ cssBtn: cssBtn});
})

module.exports = router;