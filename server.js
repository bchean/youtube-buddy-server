var bodyParser = require('body-parser'),
    cors = require('cors'),
    express = require('express'),
    mongoose = require('./mongoose-setup'),
    YouTubeService = require('youtube-node'),
    config = require('./config'),
    PingController = require('./mongo/ping.controller'),
    PingHandlers = require('./mongo/ping.handlers'),
    PingModel = require('./mongo/ping.model'),
    VideoController = require('./mongo/video.controller'),
    VideoHandlers = require('./mongo/video.handlers'),
    VideoModel = require('./mongo/video.model'),
    YouTubeWrapper = require('./youtube');

var PING_URI = '/api/pings';
var ALL_VIDEOS_URI = '/api/videos';
var SINGLE_VIDEO_URI = ALL_VIDEOS_URI + '/:youtubeId';

var app = express();

var youtubeWrapper = new YouTubeWrapper(new YouTubeService());
var mongooseConnection = mongoose.createConnection(config.mongoUri);

var Video = VideoModel.get(mongoose, mongooseConnection);
var videoController = new VideoController(Video, youtubeWrapper);
var videoHandlers = new VideoHandlers(videoController);

var Ping = PingModel.get(mongoose, mongooseConnection);
var pingController = new PingController(Ping, videoController);
var pingHandlers = new PingHandlers(pingController);

// Root directory serves static files.
app.use(express.static('public'));

// Necessary for parsing application/json.
app.use(bodyParser.json());

app.route(PING_URI)
    .all(cors())
    .get(pingHandlers.getRecentPings)
    .post(pingHandlers.pingVideo);

app.route(ALL_VIDEOS_URI)
    .get(videoHandlers.getAllVideos);

app.route(SINGLE_VIDEO_URI)
    .get(videoHandlers.getSingleVideo)
    .delete(videoHandlers.deleteVideo);

app.listen(config.expressPort, function() {
    console.log('App started on port ' + config.expressPort);
});
