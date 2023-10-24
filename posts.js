const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {type: String,
    required: true},
    body: {type: String,
    required: true},
    likes: {type: Number},
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {timestamps: true});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;