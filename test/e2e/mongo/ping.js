var mongoose = require('mongoose'),
    should = require('should'),
    config = require('../../../config'),
    PingHandlers = require('../../../mongo/ping.handlers'),
    PingModel = require('../../../mongo/ping.model');

var CUSTOM_TIMEOUT = 5000;
mongoose.connect(config.mongoUri);

describe('ping mongo handlers [e2e]', function() {
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
        it('', function() {
        });
    });

    describe('#pingVideo', function() {
        it('ping video', function(done) {
            var pingQuery = {
                dateTime: new Date(),
                youtubeId: 'TnYacrJuc7g'
            };
            var req = {body: pingQuery};
            var resStub = makeResStub(Ping, pingQuery, done);
            pingHandlers.pingVideo(req, resStub);
        });
    });
});

function removeAllPings(pingModel, done) {
    pingModel.remove({}, done);
}

function makeResStub(pingModel, pingQuery, done) {
    function verifyFunc() {
        pingModel.find({dateTime: pingQuery.dateTime}, function(err, foundPingList) {
            should.not.exist(err);
            var result = foundPingList[0];
            should.exist(result);
            var trimmedResult = {
                dateTime: result.dateTime,
                youtubeId: result.youtubeId
            };
            try {
                trimmedResult.should.deepEqual(pingQuery);
            } finally {
                done();
            }
        });
    }
    return {
        status: function() {
            return {
                send: verifyFunc
            };
        }
    };
}
