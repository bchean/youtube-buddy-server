function get(mongoose, mongooseConnection, collectionName) {
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
        numPings: {
            type: Number,
            required: true
        },
        lengthSeconds: {
            type: Number,
            required: true
        }
    });
    return mongooseConnection.model(collectionName, VideoSchema);
}

function trimRawVideo(rawVideo) {
    return {
        youtubeId: rawVideo.youtubeId,
        title: rawVideo.title,
        numPings: rawVideo.numPings,
        lengthSeconds: rawVideo.lengthSeconds
    };
}

module.exports = {
    get: get,
    trimRawVideo: trimRawVideo
};
