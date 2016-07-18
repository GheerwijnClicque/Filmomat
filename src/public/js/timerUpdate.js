$(function() {
    // Socket IO
    var socket = io.connect('http://localhost:3000');
    socket.on('time', function(data) {
        if(data.message) {
            console.log(data.message);
            $('#time').text(data.message);
        }
        else {
            console.log('there is a problem: ', data.message);
        }
    });

    socket.on('comment', function(data) {
        if(data.message) {
            $('#comment').text(data.message);
        }
        else {
            console.log('there is a problem: ', data.message);
        }
    });

    // $('#start').on('click', function() {
    //     console.log("click");
    //     var text = "testsockets";
    //     socket.emit('send', {message: text});
    // });
});
