require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Implement a Root-Level Request Logger Middleware
app.use(function (req, res, next) {
	console.log(req.method + ' ' + req.path + ' - ' + req.ip);
	next();
});

// Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve an HTML File
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

// Serve static assets
app.use('/public', express.static(__dirname + '/public'));

// Serve JSON on a specific route
app.get('/json', function (req, res) {
	// Use the .env File
	if (process.env.MESSAGE_STYLE == 'uppercase') {
		res.json({ message: 'HELLO JSON' });
	} else {
		res.json({ message: 'Hello json' });
	}
});

// Chain Middleware to Create a Time Server
app.get(
	'/now',
	function (req, res, next) {
		req.time = new Date().toString();
		next();
	},
	function (req, res) {
		res.json({ time: req.time });
	}
);

// Get Route Parameter Input from the Client
app.get('/:word/echo', function (req, res) {
	res.json({ echo: req.params.word });
});

// Get Query Parameter Input from the Client
app.get('/name', function (req, res) {
	res.json({ name: req.query.first + ' ' + req.query.last });
});

// Get Data from POST Requests
app.post('/name', function (req, res) {
	res.json({ name: req.body.first + ' ' + req.body.last });
});

module.exports = app;
