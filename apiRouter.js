//import

var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var messageCtrl = require('./routes/messageCtrl');

//route
exports.router = (function(){

	var apiRouter = express.Router();
	//users router 
	apiRouter.route('/users/register/').post(usersCtrl.register);
	apiRouter.route('/users/login/').post(usersCtrl.login);
	apiRouter.route('/users/me').get(usersCtrl.getUserProfil);
	apiRouter.route('/users/me').put(usersCtrl.UpdateUserProfil);

	//message router
	apiRouter.route('/message/new').post(messageCtrl.createMessage);
	apiRouter.route('/messages').get(messageCtrl.ListMessage);

	return apiRouter;
})();
