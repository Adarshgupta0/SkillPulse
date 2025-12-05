const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
    lessonlink: {
        type: String,
        required: true,
    },

    thumbnail: {
        type: String,
        required: true
    },
    public_thumbnail: {
        type: String,
    },
    lesson_category: {
        type: String,
        enum: ['AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA'],
        required: true
    },





});


const lessonmodel = mongoose.model('Lesson', lessonSchema);

module.exports = lessonmodel
