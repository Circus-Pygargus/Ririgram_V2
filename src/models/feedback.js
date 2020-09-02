const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
   type: {
       type: String,
       required: true
   },
   device: {
       type: String
   },
   browser: {
       type: String,
   },
   message: {
       type: String,
       required: true
   },
   owner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   }
},{
    timeStamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;