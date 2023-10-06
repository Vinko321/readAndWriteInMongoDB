const express = require('express');
const Igrac = require("../model/Igrac");
const router = express.Router();


// Showing igrac.ejs kad ništa ispred igrac ne piše
router.get("/", function (req, res) {
    let cssBtn = "btn-submit"
    let poruka= ""
    res.render("usersPages/igrac",{ cssBtn: cssBtn, poruka: poruka});
});

// Handling igrac

router.post('/', (request, response) => {
    require("../database")
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
    response.render("usersPages/igrac",{ cssBtn: cssBtn, poruka: poruka});
})

module.exports = router;