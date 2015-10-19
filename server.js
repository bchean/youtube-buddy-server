var express = require('express'),
    mongoose = require('mongoose'),
    YouTubeService = require('youtube-node'),
    config = require('./config'),
    VideoHandlers = require('./handlers/video'),
    YouTubeWrapper = require('./youtube');

var ALL_VIDEOS_URI = '/api/videos';
var SINGLE_VIDEO_URI = ALL_VIDEOS_URI + '/:youtubeId';

var app = express();
var youtubeWrapper = new YouTubeWrapper(new YouTubeService());
var videoHandlers = new VideoHandlers(mongoose, youtubeWrapper);

// Root directory serves static files.
app.use(express.static('public'));

app.route(ALL_VIDEOS_URI)
    .get(videoHandlers.getAllVideos);

app.route(SINGLE_VIDEO_URI)
    .get(videoHandlers.getSingleVideo)
    .put(videoHandlers.upsertVideo)
    .delete(videoHandlers.deleteVideo);

app.listen(config.expressPort, function() {
    console.log('App started.');
});
