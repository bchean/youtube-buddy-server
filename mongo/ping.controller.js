var _ = require('underscore'),
    PromiseUtil = require('../promise-util');

function PingController(Ping, videoController) {
    var self = this;

    function getRecentPings(sinceDateTime, resSuccessHook, resErrHook) {
        var queryPromise = Ping.find({dateTime: {$gte: sinceDateTime}}).exec();
        return queryPromise.then(makeVideoPingInfoList_promise)
        .then(function(videoPingInfoList) {
            if (resSuccessHook) {
                resSuccessHook(videoPingInfoList);
            }
            return videoPingInfoList;
        })
        .catch(function(err) {
            if (resErrHook) {
                resErrHook(err);
            }
        });
    }

    function makeVideoPingInfoList_promise(foundPingList) {
        var uniqueYoutubeIdList = Object.keys(_.chain(foundPingList)
            .groupBy('youtubeId')
            .value());
        var promise = videoController.getVideosForYoutubeIds(uniqueYoutubeIdList);
        return promise.then(function(foundVideoList) {
            return _.chain(foundVideoList)
                .groupBy('youtubeId')
                .mapObject(function(singletonList) {
                    return singletonList[0];
                })
                .value();
        })
        .then(function(videoInfosByYoutubeId) {
            return _.chain(foundPingList)
                .groupBy('youtubeId')
                .mapObject(function(pingsForVideo) {
                    var dateTimeLastPing = _.chain(pingsForVideo)
                        .map('dateTime')
                        .sort()
                        .last()
                        .value();
                    var youtubeId = pingsForVideo[0].youtubeId;
                    // TODO Handle data gaps better.
                    var videoInfo = videoInfosByYoutubeId[youtubeId] || {
                        title: 'Unknown video',
                        numPings: 0,
                        lengthSeconds: 0
                    };
                    return {
                        youtubeId: youtubeId,
                        title: videoInfo.title,
                        dateTimeLastPing: dateTimeLastPing,
                        numRecentPings: pingsForVideo.length,
                        numTotalPings: videoInfo.numPings,
                        lengthSeconds: videoInfo.lengthSeconds
                    };
                })
                .values()
                .sortBy('numRecentPings')
                .reverse()
                .value();
        });
    }

    function pingVideo(dateTime, youtubeId, resSuccessHook, resErrHook) {
        var pingToCreate = new Ping({
            dateTime: dateTime,
            youtubeId: youtubeId
        });
        var queryPromise = pingToCreate.save();

        return videoController.createNewOrPingExistingVideo(youtubeId)
        .then(function() {
            return PromiseUtil.makeBasicTwoWayQueryPromise(queryPromise, resSuccessHook, resErrHook);
        });
    }

    self.getRecentPings = getRecentPings;
    self.pingVideo = pingVideo;
}

module.exports = PingController;
