var ResUtil = require('../res-util');

function PingHandlers(pingModel) {
    var self = this;

    var resUtil = new ResUtil();

    // ------------------------
    // Request handlers
    // ------------------------

    function getRecentPings(req, res) {
        pingModel.find({}, function(err, foundPingList) {
            if (err) {
                resUtil.logAndSendError(res, err);
            } else {
                resUtil.trimAndSendRecords(res, foundPingList, trimRawPing);
            }
        });
    }

    function pingVideo(req, res) {
        var newPing = {
            dateTime: req.body.dateTime,
            youtubeId: req.body.youtubeId
        };
        pingModel.create(newPing, function(err, createdPing) {
            if (err) {
                resUtil.logAndSendError(res, err);
            } else {
                resUtil.trimAndSendRecords(res, [createdPing], trimRawPing);
            }
        });
    }

    // ------------------------
    // Helpers
    // ------------------------

    function trimRawPing(rawPing) {
        return {
            dateTime: rawPing.dateTime,
            youtubeId: rawPing.youtubeId
        };
    }

    self.getRecentPings = getRecentPings;
    self.pingVideo = pingVideo;
}

module.exports = PingHandlers;
