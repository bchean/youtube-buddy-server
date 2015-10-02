var should = require('should'),
    sinon = require('sinon'),
    YouTubeService = require('youtube-node'),
    YouTubeWrapper = require('../youtube');

describe('youtube', function() {
    describe('.getVideoInfo', function() {
        describe('E2E (live YouTube API)', function() {
            it('valid YouTube id', function(done) {
                var youtubeWrapper = new YouTubeWrapper();
                youtubeWrapper.getVideoInfo('6dBt3mJtgJc', function(err, videoInfo) {
                    should.not.exist(err);
                    videoInfo.title.should.equal('Joy Division - Transmission [OFFICIAL MUSIC VIDEO]');
                    videoInfo.lengthSeconds.should.equal(211);
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

        describe('unit (stub YouTube API)', function() {
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
});
