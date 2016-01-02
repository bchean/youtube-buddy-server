var ResUtil = require('../res-util');

function VideoHandlers(videoModel, youtubeWrapper) {
    var self = this;

    var resUtil = new ResUtil();

    // ------------------------
    // Request handlers and callback factories
    // ------------------------

    function getSingleVideo(req, res) {
        var reqYoutubeId = req.params.youtubeId;
        videoModel.findOne(
                {youtubeId: reqYoutubeId},
                makeErrorSuccessOrNotFoundCallback(
                    res,
                    logAndSendErrorResponse,
                    'Failed to get video data:',
                    trimAndSendVideo,
                    sendNoVideoDataResponse,
                    reqYoutubeId));
    }

    function makeErrorSuccessOrNotFoundCallback(res, errorFunc, errMsg, successFunc, notFoundFunc, notFoundData) {
        return function(err, successData) {
            if (err) {
                errorFunc(res, err, errMsg);
            } else if (successData) {
                successFunc(res, successData);
            } else {
                notFoundFunc(res, notFoundData);
            }
        };
    }

    function getAllVideos(req, res) {
        videoModel.find(
                {},
                makeErrorOrSuccessCallback(
                    res,
                    logAndSendErrorResponse,
                    'Failed to get video data:',
                    trimAndSendVideoList));
    }

    function makeErrorOrSuccessCallback(res, errorFunc, errMsg, successFunc) {
        return function(err, successData) {
            if (err) {
                errorFunc(res, err, errMsg);
            } else {
                successFunc(res, successData);
            }
        };
    }

    function upsertVideo(req, res) {
        var reqYoutubeId = req.params.youtubeId;
        videoModel.findOne(
                {youtubeId: reqYoutubeId},
                makeErrorSuccessOrNotFoundCallback(
                    res,
                    logAndSendErrorResponse,
                    'Failed to find requested video data:',
                    updateVideo,
                    createVideo,
                    reqYoutubeId));
    }

    function deleteVideo(req, res) {
        var reqYoutubeId = req.params.youtubeId;
        videoModel.findOneAndRemove(
                {youtubeId: reqYoutubeId},
                makeErrorSuccessOrNotFoundCallback(
                    res,
                    logAndSendErrorResponse,
                    'Failed to get video data:',
                    trimAndSendVideo,
                    sendNoVideoDataResponse,
                    reqYoutubeId));
    }

    function updateVideo(res, rawVideo) {
        rawVideo.numImpressions += 1;
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
                newVideoObj.youtubeId = youtubeId;
                newVideoObj.title = videoInfo.title;
                newVideoObj.numImpressions = 1;
                newVideoObj.lengthSeconds = videoInfo.lengthSeconds;
                newVideoObj.popularity = 0.0;

                videoModel.create(
                        newVideoObj,
                        makeErrorOrSuccessCallback(
                            res,
                            logAndSendErrorResponse,
                            'Failed to create video data:',
                            trimAndSendVideo));
            }
        });
    }

    // ------------------------
    // Helpers
    // ------------------------

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
        return {
            youtubeId: rawVideo.youtubeId,
            title: rawVideo.title,
            numImpressions: rawVideo.numImpressions,
            lengthSeconds: rawVideo.lengthSeconds,
            popularity: rawVideo.popularity
        };
    }

    self.getSingleVideo = getSingleVideo;
    self.getAllVideos = getAllVideos;
    self.upsertVideo = upsertVideo;
    self.deleteVideo = deleteVideo;
}

module.exports = VideoHandlers;
