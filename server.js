var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
var bodyParser = require('body-parser');
var todos = [];
var todoNextId =1;

//Use the body parser
app.use(bodyParser.json());



app.get('/', function (req,res){
	res.send('To do API Root');
});

app.get('/todos',function (req,res){
	var filteredTodos = todos;
	var queryParams = req.query;
	console.log(queryParams);
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(todos, {completed : true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos, {completed : false});
	}

	res.json(filteredTodos);
});

app.get('/todos/:id',function (req,res){
	// res.send('requesting for todo id : '+ req.params.id);
	var matchedTodo;
	var todoId = parseInt(req.params.id,10);
	matchedTodo = _.findWhere(todos,{id: todoId});

	if (matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
});




app.post('/todos',function (req,res){

	var body = _.pick(req.body,'description','completed');
	var temp =body.completed;
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	body.description = body.description.trim();
	//set the body id
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});


app.put('/todos/:id',function (req,res){
	var matchedTodo;
	var todoId = parseInt(req.params.id,10);
	var body = _.pick(req.body,'description','completed');
	var validAttributes = {};
	matchedTodo = _.findWhere(todos,{id: todoId});

	if(!matchedTodo){
		res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description)){
		validAttributes.description = body.description.trim();
	}else if(body.hasOwnProperty('description')){
		res.status(400).send();
	}

	_.extend(matchedTodo,validAttributes);
	res.json(matchedTodo);

});

app.delete('/todos/:id',function (req, res){
	var matchedTodo;
	var todoId = parseInt(req.params.id,10);
	matchedTodo = _.findWhere(todos,{id: todoId});
	if (matchedTodo){
		todos = _.without(todos,matchedTodo);
		res.json(matchedTodo);
	}else{
		res.status(404).json({"error": "no todo found with this id"});
	}
});


app.listen(PORT, function (){
	console.log('Starting raunaq\'s server on port ' + PORT);
});