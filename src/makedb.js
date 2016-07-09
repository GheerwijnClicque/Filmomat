var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('filmomat');

db.serialize(function() {
	db.each("SELECT film_name as filmname, iso, manufacturer, processid, process_name as processname, step_id, step_name as step, step_time as time, temp, interval, chemical, dilution FROM FILMS INNER JOIN PROCESSES ON id = film_id INNER JOIN STEPS ON process_id = process_id where film_id = 1", function(error, row) {
		console.log(row.filmname);
	});

});
