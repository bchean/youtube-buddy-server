var should = require('should'),
    YouTubeWrapper = require('../../youtube');

describe('youtube [e2e]', function() {
    describe('#getVideoInfo', function() {
        it('valid YouTube id', function(done) {
            var youtubeWrapper = new YouTubeWrapper();
            youtubeWrapper.getVideoInfo('TnYacrJuc7g', function(err, videoInfo) {
                should.not.exist(err);
                videoInfo.title.should.equal('Test video for YouTube Buddy Server');
                videoInfo.lengthSeconds.should.equal(6);
                done();
            });
        });

        it('invalid YouTube id', function(done) {
            var youtubeWrapper = new YouTubeWrapper();
            youtubeWrapper.getVideoInfo('invalid', function(err, videoInfo) {
                err.should.equal('No YouTube video exists with id: invalid');
                should.not.exist(videoInfo);
                done();
            });
        });
    });
});
