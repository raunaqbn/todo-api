var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var todos = [];
var todoNextId =1;

//Use the body parser
app.use(bodyParser.json());

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


app.post('/todos',function (req,res){
	var body = req.body;
	console.log(body);
	//set the body id
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function (){
	console.log('Starting raunaq\'s server on port ' + PORT);
});