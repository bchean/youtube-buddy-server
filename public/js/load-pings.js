var MS_PER_DAY = 24*60*60*1000;
var now_ms = Date.now();
var oneDayAgo = new Date(now_ms - MS_PER_DAY).toISOString();
var oneWeekAgo = new Date(now_ms - 7*MS_PER_DAY).toISOString();

doAjax(oneDayAgo, '.one-day-ago', '24 hours');
doAjax(oneWeekAgo, '.one-week-ago', '7 days');

function doAjax(sinceDateTime, loadingSelector, durationLabel) {
    var dataContainer = $(loadingSelector).parent();
    $.ajax({
        method: 'GET',
        url: 'api/pings',
        data: {sinceDateTime: sinceDateTime},
        dataType: 'json'
    }).done(function(videoPingInfoList) {
        $(loadingSelector).remove();
        if (videoPingInfoList.length) {
            for (var i = 0; i < videoPingInfoList.length; i++) {
                var videoPingInfo = videoPingInfoList[i];
                dataContainer.append(
                    '<div class="ping">' +
                    '[' + videoPingInfo.numRecentPings + '] ' +
                    '<a href="https://www.youtube.com/watch?v=' + videoPingInfo.youtubeId + '" target="_blank">' +
                    videoPingInfo.title + '</a> ' +
                    '<i>' + new Date(videoPingInfo.dateTimeLastPing).toLocaleString() + '</i></div>');
            }
        } else {
            dataContainer.append('No pings in the last ' + durationLabel + '!');
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        dataContainer.val(errorThrown);
    });
}
