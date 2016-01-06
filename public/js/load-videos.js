var jqXHR = $.ajax({
    method: 'GET',
    url: 'api/videos',
    dataType: 'json'
}).done(function(data) {
    $('.videos-loading').remove();
    data.sort(function(a, b) {
        return b.numPings - a.numPings;
    });
    for (var i = 0; i < data.length; i++) {
        var video = data[i];
        $('.videos-data').append('<div class="video">[' + video.numPings + '] <a href="https://www.youtube.com/watch?v=' + video.youtubeId + '" target="_blank">' + video.title + '</a></div>');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    $('.videos-data').val(errorThrown);
});
