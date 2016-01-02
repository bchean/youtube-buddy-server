function VideoModel(mongoose, collectionName) {
    collectionName = collectionName || 'video';
    var Schema = mongoose.Schema;
    var VideoSchema = new Schema({
        youtubeId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        numImpressions: {
            type: Number,
            required: true
        },
        lengthSeconds: {
            type: Number,
            required: true
        },
        popularity: {
            type: Number,
            required: true
        }
    });
    return mongoose.model(collectionName, VideoSchema);
}

module.exports = VideoModel;
