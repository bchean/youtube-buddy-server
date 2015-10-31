function PingModel(mongoose, collectionName) {
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
    return mongoose.model(collectionName, PingSchema);
}

module.exports = PingModel;
