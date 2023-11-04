const express = require('express');
const User = require("../model/User");
const bcrypt = require("bcrypt");
const router = express.Router();


// Showing register form
router.get("/", function (req, res) {
    res.render("signup");
});

// Handling user signup

router.post('/', (request, response) => {
    require("../database");
    /**
     * po postu kreiramo novo Usera
     */
    const user = new User({
        userName : request.body.userName,
        password : request.body.password,
    });

    /**
     * pomoću bcrypta kojeg smo pretodno instalirali (spremili) pomoću (npm install bcrypt --save)
     * password kodiramo da ne bude čitljiv provalnicima i zatim naredom save() spremamo kolekciju u bazu
     */
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.save().then(data => console.log('Successfully created a new User')).catch(error => console.log('Neuspjelo spremanje kolekcije User'))

    })
    response.redirect('teams')
})

module.exports = router;