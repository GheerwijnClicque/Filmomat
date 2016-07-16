$(function() {
    $('#processes').hide();

    $('#newstep').on('click', function(e) {
        e.preventDefault();
        $('#steps table').append('<tr class="step"><td><input type="text" value="2" placeholder="Developing" class="name"/></td><td><input type="time" value="" class="duration"/></td><td><input type="number" value="4" placeholder="21" class="temperature"/></td><td><input type="time" value="" class="interval"/></td><td><select class="chemical"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="water">Water</option></select></td><td><input type="text" value="TEST2:DILUTION" placeholder="1:4" class="dilution"/></td><td><a href="#" class="deleteStep"><i class="fa fa-trash-o"></i></a></td></tr>');

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
            dataType: 'json',
            success: function(data) {
                console.log("data" + JSON.stringify(data));
            }
        }).done(function(data) {
            console.log("added");
            alert("successfully added new process");
            console.log("send data: " + data);
        });
    });

    $('.process').on('click', function() {
        var processid = $(this).find('a').attr('id');

        var urlString = '../steps/'.concat(processid);
        var parent = $(this).parent();
        $.ajax({
            method: "GET",
            url: urlString,
            dataType: 'text'
        }).done(function(data) {
            // console.log(parent.find("#steps_process".concat(processid)).data());

            if(parent.find("#steps_process".concat(processid)).attr("data") === "show") {
                parent.find("#steps_process".concat(processid)).empty();
                parent.find("#steps_process".concat(processid)).attr("data", "hide");
            }
            else {
                // parent.find("#steps_process".concat(processid)).append();
                var steps = JSON.parse(data);
                parent.find("#steps_process".concat(processid)).append('<table> \
                                            <tr> \
                                              <th>Name</th> \
                                              <th>Duration</th> \
                                              <th>Temperature (&#8451;)</th> \
                                              <th>Interval</th> \
                                              <th>Chemical</th> \
                                              <th>Dilution</th> \
                                            </tr> \
                                            </table');

                for(var i = 0; i < steps.length; i++) {
                    var duration = steps[i].step_time;
                    var interval = steps[i].interval;
                    parent.find("#steps_process".concat(processid).concat(" table")).append('<tr class="step"> \
                                  <td>' + steps[i].step_name + '</td> \
                                  <td>' + duration + '</td> \
                                  <td>' + steps[i].temp + '</td> \
                                  <td>' + interval + '</td> \
                                  <td>' + steps[i].chemical + '</td> \
                                  <td>' + steps[i].dilution + '</td> \
                                </tr>');
                    console.log(steps[i]);
                }

                parent.find("#steps_process".concat(processid)).attr("data", "show");
            }
        });
    });

    // Hide process when deleting
    $('.delete').on('click', function() {
        var id = $(this).parent().find('a').attr('id');
        $("#process".concat(id)).hide();
    });

    // Delegated event to delete steps in a process (including appended steps)
    $('#steps').on('click', '.deleteStep', function(e) {
        e.preventDefault();
        $(this).parent().parent().remove();
    });
});
