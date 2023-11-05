const express = require('express');
const User = require("../model/User");
const bcrypt = require("bcrypt");
const router = express.Router();


// Showing register form
router.get("/", function (req, res) {
    let poruka = req.query.poruka;
    res.render("login", {poruka: poruka});
});

// Handling user signup
router.post('/', async  (request, response) => {
    require("../database");

    const bodyUserName = request.body.userName
    const bodyPassword = request.body.password

    // Execute query
    const user = await User.findOne({userName: bodyUserName});
    // Check if user is found in the database (based on username)
    if (!user) {
        response.redirect("login?poruka='Pod ovim korisničkim imenom još nitko nije registriran. Molimo vas promijenite korisničko ime ili se reistrirajte'");
    } else {
        let dbPassword = user.password
        let validPassword = bcrypt.compare(bodyPassword, dbPassword); // Check if password matches password provided by user
        if (!validPassword) {
            response.redirect("login?poruka='Netočna lozinka'"); // Password does not match password in database
        } else {
            response.render("teams")
        }
    }
});
module.exports = router;