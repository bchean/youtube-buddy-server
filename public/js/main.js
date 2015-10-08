var jqXHR = $.ajax({
    method: 'GET',
    url: 'api/videos',
    dataType: 'json'
}).done(function(data) {
    data.sort(function(a, b) {
        return b.numImpressions - a.numImpressions;
    });
    for (var i = 0; i < data.length; i++) {
        $('.dashboard').append('<div class="video">' + JSON.stringify(data[i]) + '</div>');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    $('.dashboard').val(errorThrown);
});
