const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({

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
    link: {
        type: String,
        required: true,
    },
    roadmap_category: {
        type: String,
        enum: ['AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA'],
        required: true
    },

}
);

const roadmapmodel = mongoose.model("Roadmap", roadmapSchema);

module.exports = roadmapmodel;
