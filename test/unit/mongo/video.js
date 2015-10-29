var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    YouTubeService = require('youtube-node'),
    VideoHandlers = require('../../../mongo/video'),
    YouTubeWrapper = require('../../../youtube');

function makeModelStub(stubs) {
    return sinon.stub(mongoose, 'model', function() {
        return {
            findOne: function(query, callback) {
                callback(stubs.err, stubs.foundVideo);
            },
            find: function(query, callback) {
                callback(stubs.err, stubs.foundVideoList);
            },
            schema: {
                paths: {
                    stubField: ''
                }
            }
        };
    });
}

function makeResponseVerifyStub(expectedResCode, expectedResObj, doneFunc) {
    return {
        status: function(actualResCode) {
            actualResCode.should.equal(expectedResCode);
            doneFunc();
            return {
                send: function(actualResObj) {
                    actualResObj.should.deepEqual(expectedResObj);
                }
            };
        }
    };
}

describe('video mongo handlers [unit]', function() {
    var mongooseStubHandle;
    var youtubeServiceStub = new YouTubeService();
    var youtubeWrapperStub = new YouTubeWrapper(youtubeServiceStub);
    var requestStub = { params: '' };

    before(function() {
        mongooseStubHandle = sinon.stub(mongoose, 'connect');
        sinon.stub(youtubeServiceStub, 'getById');
        sinon.stub(youtubeWrapperStub, 'getVideoInfo');
    });

    after(function() {
        mongooseStubHandle.restore();
    });

    describe('#getSingleVideo, #deleteVideo', function() {
        it('error response from database', function(done) {
            var stubErr = 'stub error';
            var modelStubHandle = makeModelStub({err: stubErr});
            var responseStub = makeResponseVerifyStub(500, {error: stubErr}, done);
            try {
                var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                videoHandlers.getSingleVideo(requestStub, responseStub);
            } finally {
                modelStubHandle.restore();
            }
        });

        it('found video in database', function(done) {
            var stubFoundVideo = {stubField: ''};
            var modelStubHandle = makeModelStub({foundVideo: stubFoundVideo});
            var responseStub = makeResponseVerifyStub(200, stubFoundVideo, done);
            try {
                var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                videoHandlers.getSingleVideo(requestStub, responseStub);
            } finally {
                modelStubHandle.restore();
            }
        });

        it('did not find video in database', function(done) {
            var modelStubHandle = makeModelStub({});
            var responseStub = makeResponseVerifyStub(404, {error: 'No data stored for video with Youtube id: undefined'}, done);
            try {
                var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                videoHandlers.getSingleVideo(requestStub, responseStub);
            } finally {
                modelStubHandle.restore();
            }
        });
    });

    describe('#getAllVideos', function() {
        it('error response from database', function(done) {
            var stubErr = 'stub error';
            var modelStubHandle = makeModelStub({err: stubErr});
            var responseStub = makeResponseVerifyStub(500, {error: stubErr}, done);
            try {
                var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                videoHandlers.getAllVideos(requestStub, responseStub);
            } finally {
                modelStubHandle.restore();
            }
        });

        it('found videos in database', function(done) {
            var stubFoundVideoList = [{stubField: ''}];
            var modelStubHandle = makeModelStub({foundVideoList: stubFoundVideoList});
            var responseStub = makeResponseVerifyStub(200, stubFoundVideoList, done);
            try {
                var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                videoHandlers.getAllVideos(requestStub, responseStub);
            } finally {
                modelStubHandle.restore();
            }
        });
    });

    describe('#upsertVideo', function() {
    });
});
