const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

// Showing teams.ejs kad ništa ispred teams ne piše
router.get("/", async function(req, res, next) {

        try {
                require("../database")
                const Igrac = require('../model/Igrac');
                const sort = { uzrast: 1};
                // upit za sve igrače sortirano po uzrastu
                const igraci = await Igrac.find({}).sort(sort);
                // zbog toga što distinct upit nema sortiranje stvaramo novi array od arraya igraci koji se puni samo uzrastom i to grupirano (sortirano)
                // to nam treba za iteraciju po uzrastu, odvajanje ekipa po uzrastu
                let uzrast = [...new Set(igraci.map(item => item.uzrast))];
                // const uzrast = await Igrac.distinct("uzrast"); >>> ovo je zamijenjeno gornjim kodom jer se ne može sortirati

                res.render('usersPages/teams', {igraci: igraci, uzrast: uzrast})
        } catch (error) {
                res.status(500).json({message : "Došlo je do pogreške"})
        }
})

module.exports = router;