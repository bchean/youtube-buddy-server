function ResUtil() {
    var self = this;

    function logAndSendError(res, errorWhatever) {
        console.dir(errorWhatever);
        res.status(500).send({error: errorWhatever});
    }

    function trimAndSendRecords(res, rawRecordList, trimFunc) {
        var trimmedRecordList = rawRecordList.map(trimFunc);
        res.status(200).send(trimmedRecordList);
    }

    self.logAndSendError = logAndSendError;
    self.trimAndSendRecords = trimAndSendRecords;
}

module.exports = ResUtil;
