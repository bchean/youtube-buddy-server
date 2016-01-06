// Requires a promise provider that supports catch.

function makeBasicTwoWayQueryPromise(queryPromise, resSuccessHook, resErrHook) {
    return queryPromise.then(function(foundRecord) {
        if (resSuccessHook) {
            resSuccessHook(foundRecord);
        }
        return foundRecord;
    })
    .catch(function(err) {
        if (resErrHook) {
            resErrHook(err);
        }
    });
}

function makeBasicThreeWayQueryPromise(queryPromise, resSuccessHook, resNotFoundHook, resErrHook) {
    return queryPromise.then(function(foundRecord) {
        if (resSuccessHook && foundRecord) {
            resSuccessHook(foundRecord);
        }
        if (resNotFoundHook && !foundRecord) {
            resNotFoundHook();
        }
        return foundRecord;
    })
    .catch(function(err) {
        if (resErrHook) {
            resErrHook(err);
        }
    });
}

module.exports = {
    makeBasicTwoWayQueryPromise: makeBasicTwoWayQueryPromise,
    makeBasicThreeWayQueryPromise: makeBasicThreeWayQueryPromise
};
