var ResUtil = require('../res-util'),
    VideoModel = require('./video.model');

function VideoHandlers(videoController) {
    var self = this;

    // ----------------
    // Request handlers
    // ----------------

    function getSingleVideo(req, res) {
        var reqYoutubeId = req.params.youtubeId;
        videoController.getSingleVideo(
                reqYoutubeId,
                makeFoundVideoHook(res),
                makeVideoNotFoundHook(res, reqYoutubeId),
                ResUtil.makeErrHook(res));
    }

    function getAllVideos(req, res) {
        videoController.getAllVideos(
                makeFoundVideoListHook(res),
                ResUtil.makeErrHook(res));
    }

    function deleteVideo(req, res) {
        var reqYoutubeId = req.params.youtubeId;
        videoController.deleteVideo(
                reqYoutubeId,
                makeFoundVideoHook(res),
                makeVideoNotFoundHook(res, reqYoutubeId),
                ResUtil.makeErrHook(res));
    }

    // --------------
    // Hook factories
    // --------------

    function makeFoundVideoHook(res) {
        return function(foundVideo) {
            ResUtil.trimAndSendSingleRecordResponse(res, foundVideo, VideoModel.trimRawVideo);
        };
    }

    function makeFoundVideoListHook(res) {
        return function(foundVideoList) {
            ResUtil.trimAndSendRecordListResponse(res, foundVideoList, VideoModel.trimRawVideo);
        };
    }

    function makeVideoNotFoundHook(res, reqYoutubeId) {
        return function() {
            ResUtil.sendRecordNotFoundResponse(res, reqYoutubeId);
        };
    }

    self.getSingleVideo = getSingleVideo;
    self.getAllVideos = getAllVideos;
    self.deleteVideo = deleteVideo;
}

module.exports = VideoHandlers;
