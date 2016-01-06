function get(mongoose, mongooseConnection, collectionName) {
    collectionName = collectionName || 'ping';
    var Schema = mongoose.Schema;
    var PingSchema = new Schema({
        dateTime: {
            type: Date,
            required: true
        },
        youtubeId: {
            type: String,
            required: true
        }
    });
    return mongooseConnection.model(collectionName, PingSchema);
}

function trimRawPing(rawPing) {
    return {
        dateTime: rawPing.dateTime,
        youtubeId: rawPing.youtubeId
    };
}

module.exports = {
    get: get,
    trimRawPing: trimRawPing
};
