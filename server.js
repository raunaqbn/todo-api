var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
var bodyParser = require('body-parser');
var todos = [];
var todoNextId = 1;
var db = require('./db.js');
var bcrypt = require('bcrypt');
//Use the body parser
app.use(bodyParser.json());



app.get('/', function(req, res) {
	res.send('To do API Root');
});

app.get('/todos', function(req, res) {
	var filteredTodos = todos;
	var queryParams = req.query;
	var where = {};
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}


	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function (todo){
		res.json(todo);
	}, function (e){
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
	// res.send('requesting for todo id : '+ req.params.id);
	var matchedTodo;
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo){
			res.json(todo.toJSON());
		}else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});



app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON(body));
	}, function(e){
		res.status(400).json(e);
	});
});


app.put('/todos/:id', function(req, res) {
	var matchedTodo;
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (body.hasOwnProperty('completed') ) {
		validAttributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		validAttributes.description = body.description.trim();
	}

	db.todo.findById(todoId).then(function (todo){
		if (!!todo){
			console.log(todo);
			return todo.update(validAttributes);
		}else{
			res.status(404).send();
		}
	},function (){
		res.status(500).send();
	}).then(function (todo){
		if (!!todo){
			res.json(todo.toJSON());
		}
		
	},function(e){
		res.status(400).json(e);
	});
});

app.delete('/todos/:id', function(req, res) {
	var matchedTodo;
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where:{
			id: todoId
		}
	}).then(function(rowsDeleted){
		if (rowsDeleted === 0){
			res.status(404).json({error: 'no todo with that id found'});
		}else {
			res.status(204).send();
		}
	},function (e){
		res.status(500).send();
	});
});




app.post('/users/login',function(req ,res){
	var body = _.pick(req.body,'email','password');

	db.user.authenticate(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(e){
		res.status(401).send(e);
	});
});

app.post('/users',function(req ,res){
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(e){
		res.status(400).json(e);
	});
});



db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function() {
	console.log('Starting raunaq\'s server on port ' + PORT);
	});
});

