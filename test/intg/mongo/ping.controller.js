require('should');
var config = require('../../../config'),
    mongoose = require('../../../mongoose-setup'),
    PingController = require('../../../mongo/ping.controller'),
    PingModel = require('../../../mongo/ping.model'),
    VideoController = require('../../../mongo/video.controller'),
    VideoModel = require('../../../mongo/video.model'),
    YouTubeWrapper = require('../../../youtube');

var mongooseConnection = mongoose.createConnection(config.mongoUri);

describe('[intg] ping mongo controller', function() {
    this.timeout(config.testDbTimeoutMs);

    var Video = VideoModel.get(mongoose, mongooseConnection, 'video_test');
    var videoController = new VideoController(Video, new YouTubeWrapper());
    var Ping = PingModel.get(mongoose, mongooseConnection, 'ping_test');
    var pingController = new PingController(Ping, videoController);

    before(function(done) {
        removeAllTestData(Ping, Video, done);
    });
    afterEach(function(done) {
        removeAllTestData(Ping, Video, done);
    });

    describe('#getRecentPings', function() {
        it('success', function(done) {
            var videosToCreate = [{
                youtubeId: 'a',
                title: 'title a',
                numPings: 10,
                lengthSeconds: 11
            }, {
                youtubeId: 'b',
                title: 'title b',
                numPings: 20,
                lengthSeconds: 21
            }];
            var pingsToCreate = [
                {dateTime: new Date(0), youtubeId: 'a'},
                {dateTime: new Date(1), youtubeId: 'a'},
                {dateTime: new Date(2), youtubeId: 'b'},
                {dateTime: new Date(3), youtubeId: 'b'}
            ];

            Video.create(videosToCreate)
            .then(function() {
                return Ping.create(pingsToCreate);
            })
            .then(function() {
                return pingController.getRecentPings(new Date(1));
            })
            .then(function(foundPingInfoList) {
                var expectedResults = [{
                    youtubeId: 'b',
                    title: 'title b',
                    dateTimeLastPing: new Date(3),
                    numRecentPings: 2,
                    numTotalPings: 20,
                    lengthSeconds: 21
                }, {
                    youtubeId: 'a',
                    title: 'title a',
                    dateTimeLastPing: new Date(1),
                    numRecentPings: 1,
                    numTotalPings: 10,
                    lengthSeconds: 11
                }];
                foundPingInfoList.should.deepEqual(expectedResults);
                return done();
            })
            .catch(done);
        });
    });

    describe('#pingVideo', function() {
        it('new video', function(done) {
            var newPingData = {
                dateTime: new Date(),
                youtubeId: 'TnYacrJuc7g'
            };
            pingController.pingVideo(newPingData.dateTime, newPingData.youtubeId)
            .then(function(newPing) {
                var trimmedNew = PingModel.trimRawPing(newPing);
                trimmedNew.should.deepEqual(newPingData);
            })
            .then(function() {
                return videoController.getSingleVideo(newPingData.youtubeId);
            })
            .then(function(newVideo) {
                var trimmedNew = VideoModel.trimRawVideo(newVideo);
                trimmedNew.should.deepEqual({
                    youtubeId: newPingData.youtubeId,
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
            var newPingData = {
                dateTime: new Date(),
                youtubeId: 'a'
            };
            new Video(videoToCreate).save()
            .then(function() {
                return pingController.pingVideo(newPingData.dateTime, newPingData.youtubeId)
            })
            .then(function(newPing) {
                var trimmedNew = PingModel.trimRawPing(newPing);
                trimmedNew.should.deepEqual(newPingData);
            })
            .then(function() {
                return videoController.getSingleVideo(newPingData.youtubeId);
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
});

function removeAllTestData(Ping, Video, done) {
    Ping.remove({})
    .then(function() {
        return Video.remove({});
    })
    .then(function() {
        done();
    });
}
