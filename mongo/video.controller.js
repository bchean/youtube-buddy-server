var BluebirdPromise = require('bluebird'),
    PromiseUtil = require('../promise-util');

function VideoController(Video, youtubeWrapper) {
    var self = this;

    function getSingleVideo(youtubeId, resSuccessHook, resNotFoundHook, resErrHook) {
        var queryPromise = Video.findOne({youtubeId: youtubeId}).exec();
        return PromiseUtil.makeBasicThreeWayQueryPromise(queryPromise, resSuccessHook, resNotFoundHook, resErrHook);
    }

    function getAllVideos(resSuccessHook, resErrHook) {
        var queryPromise = Video.find({}).exec();
        return PromiseUtil.makeBasicTwoWayQueryPromise(queryPromise, resSuccessHook, resErrHook);
    }

    function createNewOrPingExistingVideo(youtubeId, resSuccessHook, resErrHook) {
        var queryPromise = Video.findOne({youtubeId: youtubeId}).exec();
        return queryPromise.then(function(foundVideo) {
            if (foundVideo) {
                foundVideo.numPings += 1;
                return foundVideo.save();
            } else {
                return createVideo_promise(youtubeId);
            }
        })
        .then(function(updatedOrNewVideo) {
            if (resSuccessHook) {
                resSuccessHook(updatedOrNewVideo);
            }
            return updatedOrNewVideo;
        })
        .catch(function(err) {
            if (resErrHook) {
                resErrHook(err);
            }
        });
    }

    function createVideo_promise(youtubeId) {
        return new BluebirdPromise(function(resolve, reject) {
            youtubeWrapper.getVideoInfo(youtubeId, function(err, videoInfo) {
                if (err) {
                    reject(err);
                } else {
                    var newVideo = new Video({
                        youtubeId: youtubeId,
                        title: videoInfo.title,
                        numPings: 1,
                        lengthSeconds: videoInfo.lengthSeconds
                    });
                    newVideo.save()
                    .then(function(successVideo) {
                        resolve(successVideo);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
                }
            });
        });
    }

    function deleteVideo(youtubeId, resSuccessHook, resNotFoundHook, resErrHook) {
        var queryPromise = Video.findOneAndRemove({youtubeId: youtubeId}).exec();
        return PromiseUtil.makeBasicThreeWayQueryPromise(queryPromise, resSuccessHook, resNotFoundHook, resErrHook);
    }

    function getVideosForYoutubeIds(youtubeIdList, resSuccessHook, resErrHook) {
        var queryPromise = Video.find({youtubeId: {$in: youtubeIdList}}).exec();
        return PromiseUtil.makeBasicTwoWayQueryPromise(queryPromise, resSuccessHook, resErrHook);
    }

    self.getSingleVideo = getSingleVideo;
    self.getAllVideos = getAllVideos;
    self.createNewOrPingExistingVideo = createNewOrPingExistingVideo;
    self.deleteVideo = deleteVideo;
    self.getVideosForYoutubeIds = getVideosForYoutubeIds;
}

module.exports = VideoController;
