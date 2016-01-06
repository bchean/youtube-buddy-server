var should = require('should'),
    config = require('../../../config'),
    mongoose = require('../../../mongoose-setup'),
    VideoController = require('../../../mongo/video.controller'),
    VideoModel = require('../../../mongo/video.model'),
    YouTubeWrapper = require('../../../youtube');

var mongooseConnection = mongoose.createConnection(config.mongoUri);

describe('[intg] video mongo controller', function() {
    this.timeout(config.testDbTimeoutMs);

    var Video = VideoModel.get(mongoose, mongooseConnection, 'video_test');
    var videoController = new VideoController(Video, new YouTubeWrapper());

    before(function(done) {
        removeAllVideos(Video, done);
    });
    afterEach(function(done) {
        removeAllVideos(Video, done);
    });

    describe('#getSingleVideo', function() {
        it('success', function(done) {
            var videoToCreate = {
                youtubeId: 'a',
                title: 'b',
                numPings: 1,
                lengthSeconds: 2
            };
            new Video(videoToCreate).save()
            .then(function() {
                return videoController.getSingleVideo('a');
            })
            .then(function(foundVideo) {
                should.exist(foundVideo, 'get query should have returned a video, but it returned nothing');
                var trimmedFound = VideoModel.trimRawVideo(foundVideo);
                trimmedFound.should.deepEqual(videoToCreate);
                return done();
            })
            .catch(done);
        });
    });

    describe('#getAllVideos', function() {
        it('success', function(done) {
            var videoToCreate = {
                youtubeId: 'a',
                title: 'b',
                numPings: 1,
                lengthSeconds: 2
            };
            new Video(videoToCreate).save()
            .then(function() {
                return videoController.getAllVideos();
            })
            .then(function(foundVideoList) {
                var trimmedFoundList = foundVideoList.map(VideoModel.trimRawVideo);
                trimmedFoundList.should.deepEqual([videoToCreate]);
                return done();
            })
            .catch(done);
        });
    });

    describe('#createNewOrPingExistingVideo', function() {
        it('new video', function(done) {
            videoController.createNewOrPingExistingVideo('TnYacrJuc7g')
            .then(function(newVideo) {
                var trimmedNew = VideoModel.trimRawVideo(newVideo);
                trimmedNew.should.deepEqual({
                    youtubeId: 'TnYacrJuc7g',
                    title: 'Test video for YouTube Buddy Server',
                    numPings: 1,
                    lengthSeconds: 6
                });
                return done();
            })
            .catch(done);
        });

        it('existing video', function(done) {
            var videoToCreate = {
                youtubeId: 'a',
                title: 'b',
                numPings: 1,
                lengthSeconds: 2
            };
            new Video(videoToCreate).save()
            .then(function() {
                return videoController.createNewOrPingExistingVideo('a');
            })
            .then(function(updatedVideo) {
                var trimmedUpdated = VideoModel.trimRawVideo(updatedVideo);
                videoToCreate.numPings += 1;
                trimmedUpdated.should.deepEqual(videoToCreate);
                return done();
            })
            .catch(done);
        });
    });

    describe('#deleteVideo', function() {
        it('success', function(done) {
            var videoToCreate = {
                youtubeId: 'a',
                title: 'b',
                numPings: 1,
                lengthSeconds: 2
            };
            new Video(videoToCreate).save()
            .then(function() {
                return videoController.deleteVideo('a');
            })
            .then(function(deletedVideo) {
                should.exist(deletedVideo, 'delete query should have returned a video, but it returned nothing');
                var trimmedDeleted = VideoModel.trimRawVideo(deletedVideo);
                trimmedDeleted.should.deepEqual(videoToCreate);
                return videoController.getSingleVideo('a');
            })
            .then(function(foundVideo) {
                should.not.exist(foundVideo, 'deleted video should no longer exist');
                return done();
            })
            .catch(done);
        });
    });
});

function removeAllVideos(Video, done) {
    Video.remove({}, done);
}
