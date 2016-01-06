function logAndSendErrorResponse(res, errorWhatever) {
    console.dir(errorWhatever);
    res.status(500).send({error: errorWhatever});
}

function sendRecordNotFoundResponse(res, recordKey) {
    res.status(404).send({error: 'No record found for key: ' + recordKey});
}

function trimAndSendSingleRecordResponse(res, rawRecord, trimFunc) {
    var trimmedRecord = trimFunc(rawRecord);
    res.status(200).send(trimmedRecord);
}

function trimAndSendRecordListResponse(res, rawRecordList, trimFunc) {
    var trimmedRecordList = rawRecordList.map(trimFunc);
    res.status(200).send(trimmedRecordList);
}

function makeErrHook(res) {
    return function(err) {
        logAndSendErrorResponse(res, err);
    };
}

module.exports = {
    logAndSendErrorResponse: logAndSendErrorResponse,
    sendRecordNotFoundResponse: sendRecordNotFoundResponse,
    trimAndSendSingleRecordResponse: trimAndSendSingleRecordResponse,
    trimAndSendRecordListResponse: trimAndSendRecordListResponse,
    makeErrHook: makeErrHook
};
