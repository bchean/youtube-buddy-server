var moment = require('moment'),
    YouTubeService = require('youtube-node'),
    config = require('./config');

function YouTubeWrapper(youtubeService) {
    var self = this;

    youtubeService = youtubeService || new YouTubeService();

    function getVideoInfo(youtubeId, callback) {
        youtubeService.setKey(config.youtubeApiKey);

        youtubeService.getById(youtubeId, function(err, rawResponse) {
            if (err) {
                callback(err);
            } else if (rawResponse.items.length) {
                var videoResult = rawResponse.items[0];
                var videoInfo = {
                    title: videoResult.snippet.title,
                    lengthSeconds: convertToSeconds(videoResult.contentDetails.duration)
                };
                callback(null, videoInfo);
            } else {
                callback('No YouTube video exists with id: ' + youtubeId);
            }
        });
    }

    function convertToSeconds(isoDuration) {
        return moment.duration(isoDuration).asSeconds();
    }

    self.getVideoInfo = getVideoInfo;
}

module.exports = YouTubeWrapper;
