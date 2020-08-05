const express = require('express');

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


// Launch server
app.listen(port, hostname, () => {
    console.log(`Server is up at ${hostname}:${port}`);
});