const mongoose = require('mongoose');
const moment = require('moment');

const feedbackSchema = new mongoose.Schema({
   type: {
       type: String,
       required: true,
       trim: true
   },
   device: {
       type: String,
       trim: true
   },
   browser: {
       type: String,
       trim: true
   },
   message: {
       type: String,
       required: true,
       maxlength: 300,
       trim: true
   },
   owner: {
       type: String,
       required: true,
       ref: 'User'
   },
   answer: {
       type: String,
       maxlength: 300,
       trim: true
   },
   answerOwner: {
       type: String,
       ref: 'User'
   },
   // used to for ex if this feedback is blocked
   status: {
       type: String,
       trim: true
   }
},{
    timestamps: true
});

feedbackSchema.methods.changeTimeFormat = function () {
    // TODO remplacer celle-ci par un argument de la fonction en recevant du joueur son emplacement
    const userLocale = 'Fr';
    moment.locale('Fr');
    const feedback = this;
    const fbObject = feedback.toObject();
    fbObject.createdAt = moment(fbObject.createdAt).format('ll');
    fbObject.updatedAt = moment(fbObject.updatedAt).format('ll');
    return fbObject;
}

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;