# YouTube Buddy Server

### Running tests

#### Commands

```
# Run unit tests only
npm test

# Run integration tests only
npm run test-intg

# Run E2E tests only
npm run test-e2e

# Run all tests
npm run test-all
```

#### Special considerations

Running YouTube integration/E2E tests requires a valid API token in your .env file. The config cariable name must be YOUTUBE_API_TOKEN. Example .env file:

```
YOUTUBE_API_TOKEN=<your-api-token>
```
