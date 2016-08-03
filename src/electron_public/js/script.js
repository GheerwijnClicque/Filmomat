PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('steps');

var fillDataBase = () => {
	db.post({
		film: 'testfilm',
		iso: 400,
		manufacturer: 'Ilford',
		processes: []
	});
	db.post({
		film: 'Tri-X',
		iso: 400,
		manufacturer: 'Kodak',
		processes: [
			{
				name: 'EEN STAP',
				steps: [
					{
						name: 'STAP',
						stepTime: '10',
						temp: '21',
						interval: 2,
						chemical: 'C',
						dilution: '1:4',
						order: 0
					}
				]
			},
			{
				name: 'Process Name',
				steps: [
					{
						name: '1',
						stepTime: 10,
						temp: 34,
						interval: 2,
						chemical: 'A',
						dilution: 'TEST:DILUTION',
						order: 0
					},
					{
						name: '2',
						stepTime: 20,
						temp: 4,
						interval: 5,
						chemical: 'water',
						dilution: 'TEST2:DILUTION',
						order: 1
					}
				]
			},
			{
				name: 'TimerProcess',
				steps: [
					{
						name: '1',
						stepTime: 225,
						temp: 34,
						interval: 30,
						chemical: 'A',
						dilution: 'TEST:DILUTION',
						order: 0
					},
					{
						name: '2',
						stepTime: 294,
						temp: 4,
						interval: 30,
						chemical: 'A',
						dilution: 'TEST2:DILUTION',
						order: 1
					}
				]
			}
		]
	});
};

db.allDocs({
	include_docs: true
}).then((result) => {
	var films = result.rows;
	console.log(films);
	var html = films.map(filmListHTML).join('');
	html = '<h5 class="nav-group-title">Films</h5> \n' + html;
	console.log(html);
	$('#filmList').html(html);
}).catch((err) => {
	console.log(err);
});

// db.find({
// 	selector: {film: {$eq: 'Tri-X'}}
// }).then((result) => {
//
// });

var filmListHTML = (film) =>
`<a class="nav-group-item">
	${film.doc.film}
</a>
`;
