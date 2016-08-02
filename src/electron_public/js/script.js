var db = new PouchDB('steps');

db.post({
	title: 'test 1'
}).then(function(response) {
	console.log(response);
}).catch(function(err) {
	console.log(err);
});

db.allDocs({
	include_docs: true
}).then(function(result) {
	console.log(result);
});
