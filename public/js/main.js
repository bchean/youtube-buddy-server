var jqXHR = $.ajax({
    method: 'GET',
    url: 'api/videos',
    dataType: 'json'
}).done(function(data) {
    $('.loading').remove();
    data.sort(function(a, b) {
        return b.numImpressions - a.numImpressions;
    });
    for (var i = 0; i < data.length; i++) {
        var video = data[i];
        $('.dashboard').append('<div class="video">[' + video.numImpressions + '] <a href="https://www.youtube.com/watch?v=' + video.youtubeId + '">' + video.title + '</a></div>');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    $('.dashboard').val(errorThrown);
});
