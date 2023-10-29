const express = require('express');
const Igrac = require("../model/Igrac");
const {request} = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs')// za rad sa slikama jer ne znam kako sa sharpom uzeti sliku iz file upload
const sharp = require('sharp');// za rad sa slikama
require("../database");

// Showing igrac.ejs kad ništa ispred igrac ne piše
router.get("/", async function (req, res) {
    let id = req.query.id;

    if (id==="NoviIgrac") {
        const uzrast = req.query.uzrast;
        res.render("usersPages/igrac", {uzrast: uzrast, id:id});
    } else {
        // upit za igrača sa id=id
        const igrac = await Igrac.findOne({id:id});

            await res.render('usersPages/igrac', {igrac: igrac, id:id})

    }
});

// Handling igrac

router.post('/', async function (request, response) {
    let action = request.query.action;
    if (action==="update"){
        // Puno ime bez razmaka i dijakritičkih znakova dodjeljujemo varijalbi id
        const id = request.body.punoIme.replace(/\s/g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("đ", "d")
        //ne spremaj sliku ako nije promijenjena
        if (request.files !== null) {
            // Get the file that was set to our field named "image"
            const {image} = request.files;
            await spremiSliku(image, id)
        }
        /**
         * po postu kreiramo novog igrača
         */
        const igrac = {
            slika : "00.webp",
            id: id,
            punoIme : request.body.punoIme,
            pozicija : request.body.pozicija,
            uzrast : request.body.uzrast,
            kontaktInfo:{
                telefon: request.body.telefon,
                email: request.body.email,
                adresa:{
                    mjesto: request.body.mjesto,
                    ulica: request.body.ulica,
                    br: request.body.kucniBr,
                }
            },
            oIgracu:{
                visina : request.body.visina,
                exKlubovi: [request.body.exKlub1, request.body.exKlub2],
                uspjesi: [request.body.uspjesi1, request.body.uspjesi2],
                opis : request.body.opis
            }
        };
        await Igrac.updateOne({id: id}, igrac)
    } else{
    // Get the file that was set to our field named "image"
    const { image } = request.files;

    // If no image submitted, exit
    if (!image) return response.sendStatus(400);

    // Puno ime bez razmaka i dijakritičkih znakova dodjeljujemo varijalbi id
    const id = request.body.punoIme.replace(/\s/g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("đ", "d")
    spremiSliku(image, id)

    /**
     * po postu kreiramo novog igrača
     */
    const igrac = new Igrac({
        slika : "00.webp",
        id: id,
        punoIme : request.body.punoIme,
        pozicija : request.body.pozicija,
        uzrast : request.body.uzrast,
        kontaktInfo:{
            telefon: request.body.telefon,
            email: request.body.email,
            adresa:{
                mjesto: request.body.mjesto,
                ulica: request.body.ulica,
                br: request.body.kucniBr,
            }
        },
        oIgracu:{
            visina : request.body.visina,
            exKlubovi: [request.body.exKlub1, request.body.exKlub2],
            uspjesi: [request.body.uspjesi1, request.body.uspjesi2],
            opis : request.body.opis
        }
    });
    await igrac.save()
    }

    await response.redirect('teams')
})
async function spremiSliku(image, id) {
    // Move the uploaded image to our folder and rename

    let extName = path.extname(image.name);
    const dirSlika = "public/images/igraci/" + id;
    const dirMalihSlika = dirSlika + "/400px/";

    // check if directory exists
    if (!fs.existsSync(dirSlika)) {
        // if not create directory
        fs.mkdirSync(dirSlika);
        fs.mkdirSync(dirMalihSlika);
    }
    // preseli org sliku u dirSlika
    await image.mv(dirSlika + "/privremena" + extName);


    const formatAndSaveLargeImg = () => {
        sharp(dirSlika + "/privremena" + extName)
            .rotate()
            .toFormat('webp')
            .toFile(dirSlika + "/00.webp")
    }
    await formatAndSaveLargeImg();
    const resizeAndFormatSmallImg = () => {
        sharp(dirSlika + "/privremena" + extName)
            .resize({width: 400}) 
            .extract({width: 400, height: 500, left: 0, top: 0})
            .toFile(dirMalihSlika + "/00.webp")
    }
    await resizeAndFormatSmallImg()
    // brisanje privremene slike
    await fs.unlink(dirSlika + "/privremena" + extName, (err) => {'nismo uspjeli obrisati veliku sliku'});

}
module.exports = router;