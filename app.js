const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const teamsRouter = require('./routes/teams');
const igracRouter = require('./routes/igrac');
/**
 * dodjeljivanje puta statičkih datoteka (css, js style, images..)
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * prije dodjeljivanja bodyParser smo instalirali međusoftver bodyParser koji nam služi a privaćanje HTTP POST
 */
const bodyParser = require('body-parser');
/**
 * encoding tekstualni URL podataka (JSON) i izlaganje rezultata u req.Body
 */
app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating
/**
 * kad klijent upiše u adresnu traku ovo između navodnika koristi rutu upisanu iza zareza
 */
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/teams', teamsRouter);
app.use('/igrac', igracRouter);



app.listen(3000, () => {
    console.log('Server listening on 3000');
})


