// Load local .env for testing purposes.
require('dotenv').config({silent:true});

module.exports = {
    mongoUri: process.env.MONGO_URI,
    expressPort: process.env.PORT,
    youtubeApiKey: process.env.YOUTUBE_API_TOKEN
};
