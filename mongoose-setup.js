var BluebirdPromise = require('bluebird'),
    mongoose = require('mongoose');

mongoose.Promise = BluebirdPromise;

module.exports = mongoose;
