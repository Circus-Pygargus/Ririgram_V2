const mongoose = require('mongoose');


const infoSchema = new mongoose.Schema({
    version: {
        type: String,
        required: [true, 'Il manque la version !']
    },
    title: {
        type: String,
        required: [true, 'Il manque le titre !']
    },
    message: {
        type: String,
        required: [true, 'Il manque le message !']
    },
    notSeen: {
        type: Boolean
    }
}, {
    timestamps: true
});


// Gets infos, remove messages and check if user could have see infos
infoSchema.statics.getAllInfosTitles = async (userLastVisit) => {
    try {
        let infos, hasNewInfos = false;
        
        await Info.find({}, null, {sort: {updatedAt: -1}}, (err, docs) => {
            if (err) return res.send({error: 'il y a un problème ici !'});
            for (let i = 0, max = docs.length; i < max; i++) {
                // remove message of each info found
                let infoObject = docs[i].toObject();
                delete infoObject.message;
                // set notSeen prop to true if this info came after the last user connection
                // doesn't worl when serveur is shut down after new info but before user connection
                // infoObject.notSeen = userLastVisit < infoObject.updatedAt ? true: false;
                // if (infoObject.notSeen) hasNewInfos = true;
                if (userLastVisit < infoObject.updatedAt) {
                    infoObject.notSeen = true;
                    hasNewInfos = true;
                }
                else infoObject.notSeen = false;
                // rebuild info
                docs[i] = new Info(infoObject);
            }

            // fill infos var with modified docs
            infos = docs;
        });
        return { infos, hasNewInfos };
    }
    catch(e) {
        throw new Error(e)
    }
};


// returns the message of one info
infoSchema.statics.GetOneInfoMessage = async (infoId) => {
    const info = await mongoose.model('Info').findById(infoId);
    if (!info) throw new Error('Impossible de trouver cette info !');
    const message = info.message;
    if (!message) throw new Error('Le contenu de cette info n\'a pas été trouvé !');
    return message;
};



const Info = mongoose.model('Info', infoSchema);

module.exports = Info;