const mongoose = require('mongoose');
const moment = require('moment');

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

// feedbackSchema.pre('save', async function (next) {
//     const feedback = this;

// })

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;