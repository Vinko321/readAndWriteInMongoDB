const express = require('express');
const Igrac = require("../model/Igrac");
const mongoose = require("mongoose");
const router = express.Router();


// Showing register form
router.get("/", function (req, res) {
    res.render("cureNajmladje");
});

// Handling user signup

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
     * po postu kreiramo novog Igrac
     */
    const igrac = new Igrac({
        punoIme : request.body.punoIme,
        pozicija : request.body.pozicija,
        uzrast : request.body.uzrast,
        visina : request.body.visina,
    });

    igrac.save().then(data => console.log('Successfully created a new Igrac')).catch(error => console.log('Neuspjelo spremanje kolekcije Igrac'))
})

module.exports = router;