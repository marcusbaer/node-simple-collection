var TodoList = require('./index');
var TodoEntry = require('./index').SimpleModel;

var fetchAllCallback = function (data) {
//	console.log(TodoList);
}

TodoList.addDatasource('test.db', 'todos');
TodoList.fetchAll(fetchAllCallback);

TodoList.add(new TodoEntry({
	name: 'ABC',
	labels: ['ab', 'bc']
}));

console.log(TodoList);
