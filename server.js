var bodyParser = require('body-parser'),
    cors = require('cors'),
    express = require('express'),
    mongoose = require('mongoose'),
    YouTubeService = require('youtube-node'),
    config = require('./config'),
    PingHandlers = require('./mongo/ping.handlers'),
    PingModel = require('./mongo/ping.model'),
    VideoHandlers = require('./mongo/video.handlers'),
    VideoModel = require('./mongo/video.model'),
    YouTubeWrapper = require('./youtube');

var PING_URI = '/api/pings';
var ALL_VIDEOS_URI = '/api/videos';
var SINGLE_VIDEO_URI = ALL_VIDEOS_URI + '/:youtubeId';

var app = express();

var youtubeWrapper = new YouTubeWrapper(new YouTubeService());

mongoose.connect(config.mongoUri);
var pingHandlers = new PingHandlers(new PingModel(mongoose));
var videoHandlers = new VideoHandlers(new VideoModel(mongoose), youtubeWrapper);

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
    .put(videoHandlers.upsertVideo)
    .delete(videoHandlers.deleteVideo);

app.listen(config.expressPort, function() {
    console.log('App started on port ' + config.expressPort);
});
