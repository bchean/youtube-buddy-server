var mongoose = require('mongoose'),
    should = require('should'),
    config = require('../../../config'),
    PingHandlers = require('../../../mongo/ping.handlers'),
    PingModel = require('../../../mongo/ping.model');

var CUSTOM_TIMEOUT = 5000;
mongoose.connect(config.mongoUri);

describe('[intg] ping mongo handlers', function() {
    this.timeout(CUSTOM_TIMEOUT);

    var Ping = new PingModel(mongoose, 'ping_test');
    var pingHandlers = new PingHandlers(Ping);
    before(function(done) {
        removeAllPings(Ping, done);
    });
    afterEach(function(done) {
        removeAllPings(Ping, done);
    });

    describe('#getRecentPings', function() {
        it('empty result', function(done) {
            var pingQuery = {sinceDateTime: new Date()};
            var req = {body: pingQuery};
            var expectedResults = [];
            var resStub = makeGetRecentPingsResStub(expectedResults, done);
            pingHandlers.getRecentPings(req, resStub);
        });

        it('nonempty result', function(done) {
            var pingsToCreate = [
                {dateTime: new Date(0), youtubeId: 'a'},
                {dateTime: new Date(1), youtubeId: 'a'},
                {dateTime: new Date(2), youtubeId: 'a'}
            ];
            Ping.create(pingsToCreate, function(/*err*/) {
                // I have no idea how to cleanly assert that err is undefined. At this point in the
                // code, failing asserts just screw up the whole test. God damn javascript dude.
                // Commenting out the parameter so lint doesn't catch it.

                var pingQuery = {sinceDateTime: new Date(1)};
                var req = {body: pingQuery};
                // Results should be sorted in descending chronological order.
                var expectedResults = [
                    {dateTime: new Date(2), youtubeId: 'a'},
                    {dateTime: new Date(1), youtubeId: 'a'}
                ];
                var resStub = makeGetRecentPingsResStub(expectedResults, done);
                pingHandlers.getRecentPings(req, resStub);
            });
        });
    });

    describe('#pingVideo', function() {
        it('ping video', function(done) {
            var pingQuery = {
                dateTime: new Date(),
                youtubeId: 'TnYacrJuc7g'
            };
            var req = {body: pingQuery};
            var resStub = makePingVideoResStub(Ping, pingQuery, done);
            pingHandlers.pingVideo(req, resStub);
        });
    });
});

function removeAllPings(pingModel, done) {
    pingModel.remove({}, done);
}

function makeGetRecentPingsResStub(expectedResult, done) {
    function verifyResult(actualResult) {
        actualResult.should.deepEqual(expectedResult);
        done();
    }
    return makeResStub(verifyResult);
}

function makePingVideoResStub(pingModel, pingQuery, done) {
    function verifyPingWasCreated() {
        pingModel.find({dateTime: pingQuery.dateTime}, function(err, foundPingList) {
            should.not.exist(err);
            var result = foundPingList[0];
            should.exist(result);
            var trimmedResult = {
                dateTime: result.dateTime,
                youtubeId: result.youtubeId
            };
            trimmedResult.should.deepEqual(pingQuery);
            done();
        });
    }
    return makeResStub(verifyPingWasCreated);
}

function makeResStub(verifyFunc) {
    return {
        status: function() {
            return {
                send: verifyFunc
            };
        }
    };
}
