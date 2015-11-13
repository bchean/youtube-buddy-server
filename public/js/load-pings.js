var MS_PER_DAY = 24*60*60*1000;
var now_ms = Date.now();
var oneDayAgo = new Date(now_ms - MS_PER_DAY).toISOString();
var oneWeekAgo = new Date(now_ms - 7*MS_PER_DAY).toISOString();

$.ajax({
    method: 'GET',
    url: 'api/pings',
    data: {sinceDateTime: oneDayAgo},
    dataType: 'json'
}).done(function(videoPingInfoList) {
    $('.pings-loading').remove();
    if (videoPingInfoList.length) {
        for (var i = 0; i < videoPingInfoList.length; i++) {
            var videoPingInfo = videoPingInfoList[i];
            $('.pings-data').append(
                '<div class="ping">' +
                '[' + videoPingInfo.numPings + '] ' +
                '<a href="https://www.youtube.com/watch?v=' + videoPingInfo.youtubeId + '" target="_blank">' +
                videoPingInfo.youtubeId + '</a> ' +
                '<i>' + new Date(videoPingInfo.dateTimeLastPing).toLocaleString() + '</i></div>');
        }
    } else {
        $('.pings-data').append('No pings in the last 24 hours!');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    $('.pings-data').val(errorThrown);
});
