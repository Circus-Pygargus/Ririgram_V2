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
   owner: {
       type: String,
       required: true,
       ref: 'User'
   },
   answer: {
       type: String,
       maxlength: 300
   },
   answerOwner: {
       type: String,
       ref: 'User'
   },
},{
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;