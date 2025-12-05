const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        maxlength: 3000
    },
    icon: {
        type: String,
        enum: ['BrainCircuit', 'DatabaseZap', 'CodeXml', 'Code', 'Brain'],
        required: true,
    },
    channelname: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    tutorial_category: {
        type: String,
        enum: ['AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA'],
        required: true
    },





});


const tutorialmodel = mongoose.model('tutorial', tutorialSchema);

module.exports = tutorialmodel
