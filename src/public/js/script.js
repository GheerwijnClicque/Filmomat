$(function() {
    $('#processes').hide();

    $('.film a').on('click', function() {
        $('#processes').toggle();
    });

    $('#newstep').on('click', function() {
        $('#steps table').append('<tr class="step"><td><input type="text" value="" placeholder="Developing" id="name"/></td><td><input type="time" value="" id="duration"/></td><td><input type="number" value="" placeholder="21" id="temperature"/></td><td><input type="time" value="" id="interval"/></td><td><input type="text" value="" placeholder="T-max developer" id="chemical"/></td><td><input type="text" value="" placeholder="1:4" id="dilution"/></td><td><a href="#">Delete</a></td></tr>');
    });

    $('#submit').on('click', function(e) {
        e.preventDefault();
        $('.step').each(function() {
            $('td input').each(function() {
                console.log($(this).val());
            });
        });



    });

// \"





});
