var TodoList = require('./index');
var TodoEntry = TodoList.SimpleModel;

var fetchAllCallback = function (data) {
	console.log(TodoList);
}

TodoList.setDatasource('test.db', 'todos');
TodoList.fetchAll(fetchAllCallback);

TodoList.add(new TodoEntry({
	name: 'ABC',
	labels: ['ab', 'bc']
}));

console.log(TodoList);
