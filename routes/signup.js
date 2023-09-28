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
    const user = new User({
        firstName : request.body.firstName,
        lastName : request.body.lastName,
        userName : request.body.userName,
        password : request.body.password,
        email : request.body.email
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
})

module.exports = router;