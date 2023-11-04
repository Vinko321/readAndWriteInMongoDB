const express = require('express');
const Igrac = require("../model/Igrac");
require("../database");
const {request} = require("express");
const router = express.Router();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs')
const sharp = require('sharp');// za rad sa slikama

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
    // obriši privremene slike
    fs.readdir("public/uploaded/", (error, files) => {
        if (error) throw new Error('Could not read directory');

        files.forEach((file) => {
            const file_path = path.join("public/uploaded/", file);
            console.log(file_path);
            fs.unlink(file_path, (error)=> {
                if (error) throw new Error('Could not delete file');
                console.log(`Deleted ${file_path}`);
            });

        });
    });
});

// Handling igrac

router.post('/', async function (request, response) {
    let action = request.query.action;

        // Puno ime bez razmaka i dijakritičkih znakova dodjeljujemo varijalbi id
        const id = request.body.punoIme.replace(/\s/g, "").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("đ", "d")
        //ne spremaj sliku ako nije promijenjena
        if (request.files !== null) {
            // Get the file that was set to our field named "image"
            let imageFile = request.files.image;
            let slPathIIme = "public/uploaded/" + imageFile.name;
            await imageFile.mv("public/uploaded/" + imageFile.name, function (error) {
                if (error) {
                    console.log("Couldn't upload the image file");
                    console.log(error);
                } else {
                    console.log("Image file succesfully uploaded.");
                }
            });
            await resolveAfter2Seconds();
            await spremiSliku(slPathIIme, id);

        }

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
    if (action==="update"){
        await Igrac.updateOne({id: id}, igrac)
    } else{
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
function spremiSliku(slPathIIme, id) {

    const dirSlika = "public/images/igraci/" + id;
    const dirMalihSlika = dirSlika + "/400px/";

    // check if directory exists
    if (!fs.existsSync(dirSlika)) {
        // if not create directory
        fs.mkdirSync(dirSlika);
        fs.mkdirSync(dirMalihSlika);
    }

    const formatAndSaveLargeImg = () => {
        sharp(slPathIIme)
            .rotate()
            .toFormat('webp')
            .toFile(dirSlika + "/00.webp")
    }
    formatAndSaveLargeImg();
    const resizeAndFormatSmallImg = () => {
        sharp(slPathIIme)
            .resize({width: 400})
            .extract({width: 400, height: 500, left: 0, top: 0})
            .toFile(dirMalihSlika + "/00.webp")
    }
    resizeAndFormatSmallImg()
}
function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('2 seconds');
        }, 2000);
    });
}


module.exports = router;