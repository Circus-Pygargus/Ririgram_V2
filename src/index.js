/* NodeJS code modules */
const path = require('path');
console.log(path)

console.log(path.join(__dirname, '../templates/partials'))
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
const optionsRouter = require('./routers/options');

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

/* Setup static directory to serve */
// with this, we don't need a route for '', il will send directly to public path (so the index.html wich is inside)
// no need either of routes for '/help' and '/about' as I've created public/about/index.html and public/help/index.html
// Ici on voit bien que ce ne sera utiliser que par des pages statiques et non dynamiques ;)
// it will also give access to js and css from views ! mandatory !
app.use(express.static(publicDirectoryPath)) 

// Tell express to parse json when we receice some (NEEDED for POST requests !)
app.use(express.json());

// home route
app.get('', (req, res) => {
    res.render('index');
});

// register our routes in express
app.use(userRouter);
// app.use(gridRouter);
app.use(optionsRouter);



// 404 Error page, !! this must be the very last route
app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: 'ririgram',
        author: 'Richard Meuret',
        message404: 'Page non trouvée !'
    });
});


// Launch server
app.listen(port, hostname, () => {
    console.log(`Server is up at ${hostname}:${port}`);
});