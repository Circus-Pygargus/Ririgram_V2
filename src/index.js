/* NodeJS code modules */
const path = require('path');

/* npm modules */
const express = require('express');
// hbs module so we can use partial templates
const hbs = require('hbs');

// call mongoose.js, it will launch the file, connect to db and create database if doesn't exist
require('./db/mongoose');

// importing routes 
// not created yet
const userRouter = require('./routers/user');
// const gridRouter = require('./routers/grid');
// const optionsRouter = require('./routers/options'):

const app = express();

// for dev in vagrant 
const hostname = '192.168.0.50';

// used port
const port = 3002;

/* Define paths for express config */
// build the public path from absolute path
const publicDirectoryPath = path.join(__dirname, '../public');
// views directory
const viewsPath = path.join(__dirname, '../templates/views');
// partials templates location
const partialPath = path.join(__dirname, '../templates/partials');


/* Setup handlebars engine and views location */
// Tell express we're gonna use hbs as a template engine
app.set('view engine', 'hbs');
// Tell express we have moved the views directory
app.set('views', viewsPath);
// Tell hbs we're gonna use some partial templates
hbs.registerPartials(partialPath);



// Tell express to parse json when we receice some (NEEDED for POST requests !)
app.use(express.json());

// home route
app.get('', (req, res) => {
    res.send('Ririgram !');
});

// register our routes in express
// app.use(userRouter);
// app.use(gridRouter);
// app.use(optionsRouter);


// 404 Error page, !! this must be the very last route
app.get('*', (req, res) => {
    res.render('404', {
        title: 'ririgram',
        author: 'Richard Meuret',
        message404: 'Page non trouvée !'
    });
});


// Launch server
app.listen(port, hostname, () => {
    console.log(`Server is up at ${hostname}:${port}`);
});