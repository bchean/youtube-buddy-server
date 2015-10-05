var config = require('./config');

var YOUTUBE_ID_FIELDNAME = 'youtubeId';
var TITLE_FIELDNAME = 'title';
var NUM_IMPRESSIONS_FIELDNAME = 'numImpressions';
var LENGTH_SECONDS_FIELDNAME = 'lengthSeconds';
var POPULARITY_FIELDNAME = 'popularity';

function initVideoDbSchema(mongoose) {
    mongoose.connect(config.mongoUri);

    var Schema = mongoose.Schema;

    var videoSchemaObject = {};
    videoSchemaObject[YOUTUBE_ID_FIELDNAME] = {
        type: String,
        required: true
    };
    videoSchemaObject[TITLE_FIELDNAME] = {
        type: String,
        required: true
    };
    videoSchemaObject[NUM_IMPRESSIONS_FIELDNAME] = {
        type: Number,
        required: true
    };
    videoSchemaObject[LENGTH_SECONDS_FIELDNAME] = {
        type: Number,
        required: true
    };
    videoSchemaObject[POPULARITY_FIELDNAME] = {
        type: Number,
        required: true
    };

    var VideoSchema = new Schema(videoSchemaObject);
    var VideoModel = mongoose.model('Video', VideoSchema);

    return {
        model: VideoModel
    };
}

function Handlers(mongoose, youtubeWrapper) {
    var self = this;

    var videoDb = initVideoDbSchema(mongoose);

    // ------------------------
    // Request handlers
    // ------------------------

    function getSingleVideo(req, res) {
        var reqYoutubeId = req.params[YOUTUBE_ID_FIELDNAME];
        videoDb.model.findOne(makeVideoQuery(reqYoutubeId), function(err, rawFoundVideo) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to get video data:');
            } else if (rawFoundVideo) {
                trimAndSendVideo(res, rawFoundVideo);
            } else {
                sendNoVideoDataResponse(res, reqYoutubeId);
            }
        });
    }

    function getAllVideos(req, res) {
        videoDb.model.find({}, function(err, rawVideoList) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to get video data:');
            } else {
                trimAndSendVideoList(res, rawVideoList);
            }
        });
    }

    function upsertVideo(req, res) {
        var reqYoutubeId = req.params[YOUTUBE_ID_FIELDNAME];
        videoDb.model.findOne(makeVideoQuery(reqYoutubeId), function(err, rawFoundVideo) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to find requested video data:');
            } else if (rawFoundVideo) {
                updateVideo(res, rawFoundVideo);
            } else {
                createVideo(res, reqYoutubeId);
            }
        });
    }

    function deleteVideo(req, res) {
        var reqYoutubeId = req.params[YOUTUBE_ID_FIELDNAME];
        videoDb.model.findOneAndRemove(makeVideoQuery(reqYoutubeId), function(err, rawFoundVideo) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to remove requested video data:');
            } else if (rawFoundVideo) {
                trimAndSendVideo(res, rawFoundVideo);
            } else {
                sendNoVideoDataResponse(res, reqYoutubeId);
            }
        });
    }

    // ------------------------
    // Helpers
    // ------------------------

    function makeVideoQuery(youtubeId) {
        var conditions = {};
        conditions[YOUTUBE_ID_FIELDNAME] = youtubeId;
        return conditions;
    }

    function logAndSendErrorResponse(res, errorWhatever, errorMessage) {
        console.log(errorMessage);
        console.dir(errorWhatever);
        res.status(500).send({error: errorWhatever});
    }

    function sendNoVideoDataResponse(res, youtubeId) {
        res.status(404).send({error: 'No data stored for video with Youtube id: ' + youtubeId});
    }

    function trimAndSendVideo(res, rawVideo) {
        var trimmedVideo = trimRawVideo(rawVideo);
        res.status(200).send(trimmedVideo);
    }

    function trimAndSendVideoList(res, rawVideoList) {
        var trimmedVideoList = rawVideoList.map(trimRawVideo);
        res.status(200).send(trimmedVideoList);
    }

    function trimRawVideo(rawVideo) {
        var trimmedVideo = {};
        for (var field in videoDb.model.schema.paths) {
            // Don't copy built-in Mongo fields
            if (field[0] !== '_') {
                trimmedVideo[field] = rawVideo[field];
            }
        }
        return trimmedVideo;
    }

    function updateVideo(res, rawVideo) {
        rawVideo[NUM_IMPRESSIONS_FIELDNAME] += 1;
        // TODO recalculate popularity
        rawVideo.save(function(err) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to update video data:');
            } else {
                trimAndSendVideo(res, rawVideo);
            }
        });
    }

    function createVideo(res, youtubeId) {
        youtubeWrapper.getVideoInfo(youtubeId, function(err, videoInfo) {
            if (err) {
                logAndSendErrorResponse(res, err, 'Failed to fetch Youtube video metadata:');
            } else {
                var newVideoObj = {};
                newVideoObj[YOUTUBE_ID_FIELDNAME] = youtubeId;
                newVideoObj[TITLE_FIELDNAME] = videoInfo.title;
                newVideoObj[NUM_IMPRESSIONS_FIELDNAME] = 1;
                newVideoObj[LENGTH_SECONDS_FIELDNAME] = videoInfo.lengthSeconds;
                newVideoObj[POPULARITY_FIELDNAME] = 0.0;

                videoDb.model.create(newVideoObj, function(err, rawCreatedVideo) {
                    if (err) {
                        logAndSendErrorResponse(res, err, 'Failed to create video data:');
                    } else {
                        trimAndSendVideo(res, rawCreatedVideo);
                    }
                });
            }
        });
    }

    self.getSingleVideo = getSingleVideo;
    self.getAllVideos = getAllVideos;
    self.upsertVideo = upsertVideo;
    self.deleteVideo = deleteVideo;
}

module.exports = Handlers;
