const mongoose = require('mongoose');

// here ririgram is the name of the database
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://127.0.0.1:27017/ririgram');



// used during development when need to delete the database

// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log('*** MongoDB got connected ! ***')
//     console.log(`Our Current DataBase Name : ${connection.db.databaseName}`)
        
//     mongoose.connection.db.dropDatabase(
//         console.log(`${connection.db.dababaseName} database dropped.`)
//     )
// });