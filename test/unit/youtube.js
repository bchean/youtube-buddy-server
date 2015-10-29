var should = require('should'),
    sinon = require('sinon'),
    YouTubeService = require('youtube-node'),
    YouTubeWrapper = require('../../youtube');

describe('youtube [unit]', function() {
    describe('#getVideoInfo', function() {
        it('error response from YouTube API', function(done) {
            var stubYoutube = new YouTubeService();
            sinon.stub(stubYoutube, 'getById', function(youtubeId, func) {
                func('Stub error');
            });

            var youtubeWrapper = new YouTubeWrapper(stubYoutube);
            youtubeWrapper.getVideoInfo('', function(err, videoInfo) {
                err.should.equal('Stub error');
                should.not.exist(videoInfo);
                done();
            }, stubYoutube);
        });
    });
});
