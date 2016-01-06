var ResUtil = require('../res-util'),
    PingModel = require('./ping.model');

function PingHandlers(pingController) {
    var self = this;

    // ----------------
    // Request handlers
    // ----------------

    function getRecentPings(req, res) {
        var sinceDateTime = req.query.sinceDateTime;
        pingController.getRecentPings(
                sinceDateTime,
                makeFoundPingListHook(res),
                ResUtil.makeErrHook(res));
    }

    function pingVideo(req, res) {
        var dateTime = req.body.dateTime;
        var youtubeId = req.body.youtubeId;
        pingController.pingVideo(
                dateTime,
                youtubeId,
                makePingCreatedHook(res),
                ResUtil.makeErrHook(res));
    }

    // --------------
    // Hook factories
    // --------------

    function makeFoundPingListHook(res) {
        return function(foundPingList) {
            ResUtil.trimAndSendRecordListResponse(res, foundPingList, noTrim);
        };
    }

    function noTrim(x) {
        return x;
    }

    function makePingCreatedHook(res) {
        return function(createdPing) {
            ResUtil.trimAndSendSingleRecordResponse(res, createdPing, PingModel.trimRawPing);
        };
    }

    self.getRecentPings = getRecentPings;
    self.pingVideo = pingVideo;
}

module.exports = PingHandlers;
