// imports 
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
//Instanciation 
var server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//config Route 
server.get('/',function(req,res){
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send('<h1> Bonjour </h1>');
});

server.use('/api/',apiRouter);

//lancer serveur 
server.listen(8080, function() {
	console.log('serveur en ecoute ');
})