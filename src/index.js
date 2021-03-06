/* NodeJS code modules */
const path = require('path');

/* npm modules */
const express = require('express');
// hbs module so we can use partial templates
const hbs = require('hbs');
// Dot env for security variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// call mongoose.js, it will launch the file, connect to db and create database if doesn't exist
require('./db/mongoose');

// importing routes 
// not created yet
const userRouter = require('./routers/user');
const gridRouter = require('./routers/grid');
const optionsRouter = require('./routers/options');
const infoRouter = require('./routers/info');
const feedbackRouter = require('./routers/feedback');

const app = express();

// for dev in vagrant 
// const hostname = '192.168.0.50;
// using dotenv
const hostname = process.env.APP_HOSTNAME;
const port = process.env.APP_PORT;

// used port
// const port = 3002;

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
// Tell hbs that we need to use ifEquals to compare 2 values in hbs files
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
// Could be usefull
// hbs.registerHelper("when", (operand_1, operator, operand_2, options) => {
//     let operators = {                     //  {{#when <operand1> 'eq' <operand2>}}
//       'eq': (l,r) => l == r,              //  {{/when}}
//       'noteq': (l,r) => l != r,
//       'gt': (l,r) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
//       'gteq': (l,r) => ((+l) > (+r)) || (l == r),        //               eq
//       'lt': (l,r) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
//       'lteq': (l,r) => ((+l) < (+r)) || (l == r),        //               gt
//       'or': (l,r) => l || r,                             // {{else}}
//       'and': (l,r) => l && r,                            //               lt
//       '%': (l,r) => (l % r) === 0                        // {{/when}}
//     }
//     let result = operators[operator](operand_1,operand_2);
//     if(result) return options.fn(this); 
//     return options.inverse(this);       
//   });
// hbs.registerHelper('compare', function(lvalue, rvalue, options) {

// 	if (arguments.length < 3)
// 	    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

// 	operator = options.hash.operator || "==";

// 	var operators = {
// 	    '==':       function(l,r) { return l == r; },
// 	    '===':      function(l,r) { return l === r; },
// 	    '!=':       function(l,r) { return l != r; },
// 	    '<':        function(l,r) { return l < r; },
// 	    '>':        function(l,r) { return l > r; },
// 	    '<=':       function(l,r) { return l <= r; },
// 	    '>=':       function(l,r) { return l >= r; },
// 	    'typeof':   function(l,r) { return typeof l == r; }
// 	}

// 	if (!operators[operator])
// 	    throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

// 	var result = operators[operator](lvalue,rvalue);

// 	if( result ) {
// 	    return options.fn(this);
// 	} else {
// 	    return options.inverse(this);
// 	}
// });



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
app.use(gridRouter);
app.use(optionsRouter);
app.use(infoRouter);
app.use(feedbackRouter);



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