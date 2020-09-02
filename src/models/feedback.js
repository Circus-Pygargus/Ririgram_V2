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
       required: true,
       maxlength: 300
   },
   answer: {
       type: String,
       maxlength: 300
   },
   owner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   },
   answerOwner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
   },
},{
    timeStamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;