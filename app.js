const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const teamsRouter = require('./routes/teams');
const igracRouter = require('./routes/igrac');
/**
 * dodjeljivanje puta statičkih datoteka (css, js style, images..)
 */
app.use(express.static(path.join(__dirname, 'public')));

// Use the express-fileupload middleware za uploadat slike
app.use(fileUpload());
/**
 * prije dodjeljivanja bodyParser smo instalirali međusoftver bodyParser koji nam služi a privaćanje HTTP POST
 */
const bodyParser = require('body-parser');
const {login} = require("passport/lib/http/request");
/**
 * encoding tekstualni URL podataka (JSON) i izlaganje rezultata u req.Body
 */
app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating
/**
 * kad klijent upiše u adresnu traku ovo između navodnika koristi rutu upisanu iza zareza
 */
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/teams', teamsRouter);
app.use('/igrac', igracRouter);
app.use('/login', loginRouter);


app.listen(3000, () => {
    console.log('Server listening on 3000');
})


