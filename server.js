var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Call up home and catch up with everyone',
	completed: false
},{
	id: 2,
	description: 'Go to gym',
	completed: false
}];

app.get('/', function (req,res){
	res.send('To do API Root');
});

app.get('/todos',function (req,res){
	res.json(todos);
});

app.get('/todos/:id',function (req,res){
	// res.send('requesting for todo id : '+ req.params.id);
	var matchedTodo;
	todos.forEach(function (todo){
		if (todo.id === parseInt(req.params.id,10)) {
			matchedTodo = todo;
		}
	});

	if (matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
});

app.listen(PORT, function (){
	console.log('Starting raunaq\'s server on port ' + PORT);
});