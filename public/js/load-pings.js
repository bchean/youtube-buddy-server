var MS_PER_DAY = 24*60*60*1000;
var now_ms = Date.now();
var oneDayAgo = new Date(now_ms - MS_PER_DAY);
var oneWeekAgo = new Date(now_ms - 7*MS_PER_DAY);

$.ajax({
    method: 'GET',
    url: 'api/pings',
    data: {sinceDateTime: oneDayAgo},
    dataType: 'json'
}).done(function(data) {
    $('.pings-loading').remove();
    if (data.length) {
        for (var i = 0; i < data.length; i++) {
            var ping = data[i];
            $('.pings-data').append(
                '<div class="ping">' +
                '[' + ping.dateTime + '] ' +
                '<a href="https://www.youtube.com/watch?v=' + ping.youtubeId + '" target="_blank">' +
                ping.youtubeId + '</a></div>');
        }
    } else {
        $('.pings-data').append('No pings in the last 24 hours!');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    $('.pings-data').val(errorThrown);
});
