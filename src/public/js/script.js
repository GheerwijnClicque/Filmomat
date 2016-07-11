$(function() {
    $('#processes').hide();

    $('.film a').on('click', function() {
        $('#processes').toggle();
    });

    $('#newstep').on('click', function() {
        console.log("new step");
        $('#steps').append("<ul class=\"step\">    <div id=\"left\"> <li><p>Name:</p><input name=\"name\" type=\"text\"/></li><li><p>Duration:</p><input name=\"name\" type=\"text\"/></li><li><p>Temperature:</p><input name=\"name\" type=\"text\"/></div>  <div id=\"right\"> </li><li><p>Interval:</p><input name=\"name\" type=\"text\"/></li><li><p>Chemical:</p><input name=\"name\" type=\"text\"/></li><li><p>Dilution:</p><input name=\"name\" type=\"text\"/></li></div>  </ul>");
    });








});
