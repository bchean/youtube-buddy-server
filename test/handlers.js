var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    YouTubeService = require('youtube-node'),
    VideoHandlers = require('../handlers/video'),
    YouTubeWrapper = require('../youtube');

function makeModelFindOneStub(err, rawFoundVideo) {
    return sinon.stub(mongoose, 'model', function() {
        return {
            findOne: function(query, callback) {
                callback(err, rawFoundVideo);
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

describe('video handlers', function() {
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

    describe('#getSingleVideo', function() {
        describe('unit', function() {
            it('error response from database', function(done) {
                var errorStub = 'stub error';
                var findOneStubHandle = makeModelFindOneStub(errorStub);
                var responseStub = makeResponseVerifyStub(500, {error: errorStub}, done);
                try {
                    var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                    videoHandlers.getSingleVideo(requestStub, responseStub);
                } finally {
                    findOneStubHandle.restore();
                }
            });

            it('found video in database', function(done) {
                var videoStub = {stubField: ''};
                var findOneStubHandle = makeModelFindOneStub(null, videoStub);
                var responseStub = makeResponseVerifyStub(200, videoStub, done);
                try {
                    var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                    videoHandlers.getSingleVideo(requestStub, responseStub);
                } finally {
                    findOneStubHandle.restore();
                }
            });

            it('did not find video in database', function(done) {
                var findOneStubHandle = makeModelFindOneStub(null, null);
                var responseStub = makeResponseVerifyStub(404, {error: 'No data stored for video with Youtube id: undefined'}, done);
                try {
                    var videoHandlers = new VideoHandlers(mongoose, youtubeWrapperStub);
                    videoHandlers.getSingleVideo(requestStub, responseStub);
                } finally {
                    findOneStubHandle.restore();
                }
            });
        });
    });

    describe('#getAllVideos', function() {
        describe('unit', function() {
        });
    });

    describe('#upsertVideo', function() {
        describe('unit', function() {
        });
    });

    describe('#deleteVideo', function() {
        describe('unit', function() {
        });
    });
});
