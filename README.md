# YouTube Buddy Server

### Running tests

#### Commands

```
# Run unit tests only
npm test

# Run all tests (including E2E tests)
npm run test-all
```

#### Special considerations

Running YouTube E2E tests requires a valid API token in your .env file. The config cariable name must be YOUTUBE_API_TOKEN. Example .env file:

```
YOUTUBE_API_TOKEN=<your-api-token>
```
