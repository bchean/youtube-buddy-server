var mongoose = require('mongoose'),
    should = require('should'),
    sinon = require('sinon'),
    YouTubeService = require('youtube-node'),
    Handlers = require('../handlers'),
    YouTubeWrapper = require('../youtube');

function makeModelFindOneStub(err, rawFoundVideo) {
    return sinon.stub(mongoose, 'model', function() {
        return {
            findOne: function(query, callback) {
                callback(err, rawFoundVideo);
            }
        };
    });
}

function makeResponseVerifyStub(responseCode, doneFunc) {
    return {
        status: function(code) {
            code.should.equal(responseCode);
            doneFunc();
            return {
                send: function() {}
            };
        }
    };
}

describe('handlers', function() {
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
                var findOneStubHandle = makeModelFindOneStub('err');
                var responseStub = makeResponseVerifyStub(500, done);
                var handlers = new Handlers(mongoose, youtubeWrapperStub);
                handlers.getSingleVideo(requestStub, responseStub);
                findOneStubHandle.restore();
            });

            it('found video in database', function(done) {
                var findOneStubHandle = makeModelFindOneStub(null, {});
                var responseStub = makeResponseVerifyStub(200, done);
                var handlers = new Handlers(mongoose, youtubeWrapperStub);
                handlers.getSingleVideo(requestStub, responseStub);
                findOneStubHandle.restore();
            });

            it('did not find video in database', function(done) {
                var findOneStubHandle = makeModelFindOneStub(null, null);
                var responseStub = makeResponseVerifyStub(404, done);
                var handlers = new Handlers(mongoose, youtubeWrapperStub);
                handlers.getSingleVideo(requestStub, responseStub);
                findOneStubHandle.restore();
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
