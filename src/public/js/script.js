$(function() {
    $('#processes').hide();

    $('.film a').on('click', function() {
        $('#processes').toggle();
    });

    $('#newstep').on('click', function() {
        $('#steps table').append('<tr class="step"><td><input type="text" value="2" placeholder="Developing" class="name"/></td><td><input type="time" value="" class="duration"/></td><td><input type="number" value="4" placeholder="21" class="temperature"/></td><td><input type="time" value="" class="interval"/></td><td><select class="chemical"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="water">Water</option></select></td><td><input type="text" value="TEST2:DILUTION" placeholder="1:4" class="dilution"/></td><td><a href="#">Delete</a></td></tr>');
    });

    $('#submitProcess').on('click', function(e) {
        e.preventDefault();
        var steps = [];
        $('.step').each(function() {
            var name = $(this).find('.name').val();
            var duration = $(this).find('.duration').val();
            var temperature = $(this).find('.temperature').val();
            var interval = $(this).find('.interval').val();
            var chemical = $(this).find('.chemical').val();
            var dilution = $(this).find('.dilution').val();

            var step = {name: name, duration: duration, temperature: temperature, interval:  interval, chemical: chemical, dilution: dilution};
			steps.push(step);
        });

        var urlString = '../addprocess/'.concat($('#filmID').text());
        $.ajax({
            method: "POST",
            url: urlString,
            data: JSON.stringify({
                name: $('#processName').val(),
                data: steps
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function(data) {
            console.log("send data: " + data);
        });
    });






});
